// utils/process-invoices.ts
export const processInvoices = (invoices: any[]) => {
    const statusCounts: { [key: string]: number } = {};
  
    invoices.forEach(invoice => {
      const status = invoice.Status;
      if (statusCounts[status]) {
        statusCounts[status]++;
      } else {
        statusCounts[status] = 1;
      }
    });
  
    const totalInvoices = invoices.length;
    const statusData = Object.keys(statusCounts).map(status => ({
      status,
      count: statusCounts[status],
      percentage: (statusCounts[status] / totalInvoices) * 100
    }));
  
    return statusData;
  };