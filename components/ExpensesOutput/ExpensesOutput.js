import { View, Text, FlatList, StyleSheet } from "react-native";
import ExpensesSummary from "./ExpensesSummary";
import ExpensesList from "./ExpensesList";
import { GlobalStyles } from "../../Contants/styles";

const DUMMY_EXPENSES = [
  {
    id: "e1",
    description: "pair of shoes",
    amount: 56.66,
    date: new Date("2021-12-19"),
  },
  {
    id: "e2",
    description: "Bike",
    amount: 1233.23,
    date: new Date("2021-12-16"),
  },
  {
    id: "e3",
    description: "House",
    amount: 12321.12,
    date: new Date("2021-12-18"),
  },
  {
    id: "e4",
    description: "Jacker",
    amount: 100.23,
    date: new Date("2021-05-19"),
  },
];

function ExpensesOutput({ expenses, expensesPeriod, fallBackText }) {
  let content = <Text style={styles.infoText}>{fallBackText}</Text>;
  if (expenses.length > 0) {
    content = <ExpensesList expenses={expenses} />;
  }
  return (
    <View style={styles.container}>
      <ExpensesSummary expenses={expenses} periodName={expensesPeriod} />
      {content}
    </View>
  );
}

export default ExpensesOutput;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 24,
    backgroundColor: GlobalStyles.colors.primary700,
  },
  infoText: {
    color: "white",
    textAlign: "center",
    fontSize: 16,
    marginTop: 32,
  },
});
