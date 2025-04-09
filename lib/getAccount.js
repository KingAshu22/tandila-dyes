export async function getAccount(code) {
    try {
        const [entriesRes, invoicesRes] = await Promise.all([
            fetch(`/api/entry/client/${code}`),
            fetch(`/api/invoice/client/${code}`),
        ]);
        const [entries, invoices] = await Promise.all([
            entriesRes.json(),
            invoicesRes.json(),
        ]);

        const debitItems = entries.flatMap((entry) => {
            const totalAmount = entry.workOrder.reduce((sum, order) => sum + order.amount, 0);
            return {
                date: new Date(entry.date),
                debit: totalAmount,
                credit: 0,
            };
        });

        const creditItems = invoices.flatMap((invoice) =>
            invoice.paymentReceived.map((payment) => ({
                date: new Date(payment.date),
                debit: 0,
                credit: payment.amount,
            }))
        );

        const allItems = [...debitItems, ...creditItems].sort((a, b) => a.date - b.date);

        let runningBalance = 0;
        const balanceSheetItems = allItems.map((item) => {
            runningBalance = runningBalance + item.debit - item.credit;
            return {
                ...item,
                balance: runningBalance,
            };
        });

        const totalDebit = balanceSheetItems.reduce((sum, item) => sum + item.debit, 0);
        const totalCredit = balanceSheetItems.reduce((sum, item) => sum + item.credit, 0);
        const finalBalance = totalDebit - totalCredit;

        return {
            totalDebit,
            totalCredit,
            finalBalance,
        };
    } catch (error) {
        console.error("Error fetching account data:", error);
        return {
            totalDebit: 0,
            totalCredit: 0,
            finalBalance: 0,
        };
    }
}
