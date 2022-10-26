/// <reference types="cypress" />

import { format, prepareLocalStorage } from '../../support/utils'


context('Finance Planer', () => {

    beforeEach(() => {
        cy.visit('https://devfinance-agilizei.netlify.app/#', {
        onBeforeLoad: (win) => {
          prepareLocalStorage(win)
        } 
      })                
    });

    it('Cadastrar entradas', () => {

        const entrada = 'Salário'
        
        
        cy.get('#transaction .button').click()
        cy.get('#description').type(entrada)
        cy.get('#amount').type(900)
        cy.get('#date').type('2022-10-26')
        cy.get('button').contains('Salvar').click()

        cy.get('#data-table tbody tr').should('have.length', 3)        
    });

    it('Cadastrar Saídas', () => {
        

        cy.get('#transaction .button').click()
        cy.get('#description').type('Compra')
        cy.get('#amount').type(-50)
        cy.get('#date').type('2022-10-26')
        cy.get('button').contains('Salvar').click()

        cy.get('#data-table tbody tr').should('have.length', 3)
        
    });

    it('Remover entradas e saídas', () => {
        
        cy.get('td.description')
          .contains("Salário")
          .parent()
          .find('img[onclick*=remove]')
          .click()    

        cy.get('#data-table tbody tr').should('have.length', 1)

        cy.get('td.description')
          .contains("Compra")
          .siblings()
          .children('img[onclick*=remove]')
          .click()
        
          cy.get('#data-table tbody tr').should('have.length', 0)  
    });

    it('Validar saldo', () => {

        cy.get('#data-table tbody tr').should('have.length', 2)

        let incomes = 0
        let expenses = 0

        cy.get('#data-table tbody tr')
          .each(($el, index, $list) => {         

            cy.get($el).find('td.income, td.expense')
              .invoke('text').then(text => {
                
                if (text.includes('-')) {
                    expenses = expenses + format(text)
                } else {
                    incomes = incomes + format(text)
                }
                
            cy.log('entradas', incomes)
            cy.log('saidas', expenses)  

            })

          });

        cy.get('#totalDisplay').invoke('text').then(text => {            
            let formattedTotalDisplay = format(text)
            let expectedTotal = incomes + expenses

            expect(formattedTotalDisplay).to.eq(expectedTotal)

        })         


                  
    });
});