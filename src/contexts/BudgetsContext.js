import React, { useContext, useState } from "react";
import { v4 as uuidV4 } from "uuid"
import useLocalStorage from "../hooks/useLocalStorage";

const BudgetsContext = React.createContext();


export const UNCATEGORIZED_BUDGET_ID = "Sem categoria"

/* nessa função esta todos nossos contexts então passando ela conseguimos acessar tudo daqui */
export function useBudgets() {
  return useContext(BudgetsContext);
}

export const BudgetsProvider = ({ children }) => {
  const [budgets, setBudgets] = useLocalStorage("budgets",[]);
  const [expenses, setExpenses] = useLocalStorage("expenses",[]);

  /* aqui estamos filtrando o state exenses filtrando ele e falando que só queremos retornar os itens no qual o BudgetId é igual o budgetId que estamos passando */
  function getBudgetExpenses(budgetId) {
    return expenses.filter(expense => expense.budgetId === budgetId)
  }
  /* aqui estamos indo no state Setexpenses retornando os itens que ja estão nele e em seguida adicionando um novo item como objeto o qual tem um id,descrição,amount e budgetID */
  function addExpense({ description, amount, budgetId }) {
    setExpenses(prevExpenses => {
      return [...prevExpenses, { id: uuidV4(), description, amount, budgetId }];
    });
  }
  /* aqui estamos fazendo basicamente a mesma coisa de cima a única diferença é que fazemos um verifificação, falando que se nosso state ja tiver um item com o mesmo nome o qual estamos passando não é póssivel adicionart o mesmo por isso só retornamos o state anterior */
  function addBudget({ name, max }) {
    setBudgets(prevBudgets => {
      if (prevBudgets.find((budget) => budget.name === name)) {
        return prevBudgets;
      }
      return [...prevBudgets, { id: uuidV4(), name, max }];
    });
  }
  /* aqui estamos filtrando o state setBudgets e falando que todos os itens dele não tem o mesmo id que estamos passando, como o id que estamos passando é de um item que já foi adicionado essa função vai retornar false e apagar o item o qual o id é igual para assim forçar um true */
  function deleteBudget({ id }) {
    setBudgets(prevBudgets => {
      return prevBudgets.filter((budget) => budget.id !== id);
    });
  }
  /* mesma lógica da de cima */
  function deleteExpense({ id }) {
    setExpenses(prevExpenses => {
      return prevExpenses.filter((expense) => expense.id !== id);
    });
  }

  return (
    /* aqui estamos usando context para passar para todo children desse elemento essas funções */
    <BudgetsContext.Provider
      value={{
        budgets,
        expenses,
        getBudgetExpenses,
        addExpense,
        addBudget,
        deleteBudget,
        deleteExpense,
      }}
    >
      {children}
    </BudgetsContext.Provider>
  );
};
