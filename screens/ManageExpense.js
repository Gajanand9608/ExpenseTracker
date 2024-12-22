import { useLayoutEffect, useState } from "react";
import { Text, View, StyleSheet } from "react-native";
import { GlobalStyles } from "../Contants/styles";
import IconButton from "../components/UI/IconButton";
import Button from "../components/UI/Button";
import { ExpensesContext } from "../store/expense-context";
import { useContext } from "react";
import ExpenseForm from "../components/ManageExpense/ExpenseForm";
import { deleteExpense, storeExpense, updateExpense } from "../util/http";
import LoadingOverlay from "../components/UI/LoadingOverlays";

function ManageExpense({ route, navigation }) {
  const expensesCtx = useContext(ExpensesContext);
  const expenseId = route.params?.expenseId;
  const [error, setError] = useState();
  const [isSubmitting, setIsSubitting] = useState(false);
  const isEditing = !!expenseId;
  const selectedExpense = expensesCtx.expenses.find(
    (expense) => expense.id === expenseId
  );

  useLayoutEffect(() => {
    navigation.setOptions({
      title: isEditing ? "Edit Expense" : "Add Expense",
    });
  }, [navigation, isEditing]);

  async function deleteExpenseHandler() {
    setIsSubitting(true);
    try {
      expensesCtx.deleteExpense(expenseId);
      await deleteExpense(expenseId);
      navigation.goBack();
    } catch (error) {
      setError("Could not delete expense");
    }
    setIsSubitting(false);
  }

  function cancelHandler() {
    navigation.goBack();
  }

  async function confirmHandler(expenseData) {
    setIsSubitting(true);
    if (isEditing) {
      expensesCtx.updateExpense(expenseId, expenseData);
      try {
        await updateExpense(expenseId, expenseData);
        navigation.goBack();
      } catch (error) {
        setError("Could not update expense");
      }
    } else {
      try {
        const id = await storeExpense(expenseData);
        expensesCtx.addExpense({ ...expenseData, id: id });
        navigation.goBack();
      } catch (error) {
        setError("Could not add expense");
      }
    }
    setIsSubitting(false);
  }

  if (error && !isSubmitting) {
    return <ErrorOverlay message={error} />;
  }

  if (isSubmitting) {
    return <LoadingOverlay />;
  }

  return (
    <View style={styles.container}>
      <ExpenseForm
        defaultValues={selectedExpense}
        submitButtonLabel={isEditing ? "Update" : "Add"}
        onSubmit={confirmHandler}
        onCancel={cancelHandler}
      />
      {isEditing && (
        <View style={styles.deleteContainer}>
          <IconButton
            icon="trash"
            color={GlobalStyles.colors.error500}
            size={36}
            onPress={deleteExpenseHandler}
          />
        </View>
      )}
    </View>
  );
}

export default ManageExpense;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 24,
    backgroundColor: GlobalStyles.colors.primary800,
  },
  buttons: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
  },
  button: {
    minWidth: 120,
    marginHorizontal: 8,
  },
  deleteContainer: {
    marginTop: 16,
    paddingTop: 8,
    borderTopWidth: 2,
    borderTopColor: GlobalStyles.colors.primary200,
    alignItems: "center",
  },
});
