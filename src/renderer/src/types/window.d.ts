declare global {
  interface Window {
    api: {
      sendCustomer: (customer: any) => Promise<any>;
    };
  }
}