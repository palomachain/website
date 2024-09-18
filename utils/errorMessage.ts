export const errorMessage = (e: any) => {
  console.log('e', e);
  const message = (e?.data?.message ? e?.data?.message : e?.message ? e?.message : e).toLowerCase();

  if (message?.includes('insufficient')) {
    return 'Your wallet balance is too low to cover transaction costs.';
  } else if (message?.includes('user rejected') || message?.includes('declined')) {
    return 'Transaction is rejected by user.';
  } else if (message?.includes('already processing eth')) {
    return 'Already processing your wallet. Please check.';
  } else if (message?.includes('already used')) {
    return 'Already activated. Please refresh the website.';
  } else {
    return message;
  }
};
