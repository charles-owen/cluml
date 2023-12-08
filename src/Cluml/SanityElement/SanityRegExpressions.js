export const VISIBILITY_RX = /^[+#-]/;
export const NAME_RX = /\w+(?=\()/g;
export const PAREM_RX = /\(.*\)/g;
export const SPACES_RX = /\s/;
export const NON_ALPHABETICAL_RX = /[^A-Za-z]/;

// exclude spaces from non-alphanumeric so that only one sanity check
// message shows up for spaces
export const NON_ALPHANUMERIC_RX = /[^A-Za-z0-9\s]/;
