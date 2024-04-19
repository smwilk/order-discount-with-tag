// @ts-check
import { DiscountApplicationStrategy } from "../generated/api";

// Use JSDoc annotations for type safety
/**
* @typedef {import("../generated/api").RunInput} RunInput
* @typedef {import("../generated/api").FunctionRunResult} FunctionRunResult
* @typedef {import("../generated/api").Target} Target
* @typedef {import("../generated/api").ProductVariant} ProductVariant
*/

/**
* @type {FunctionRunResult}
*/
const EMPTY_DISCOUNT = {
  discountApplicationStrategy: DiscountApplicationStrategy.First,
  discounts: [],
};

// The configured entrypoint for the 'purchase.product-discount.run' extension target
/**
* @param {RunInput} input
* @returns {FunctionRunResult}
*/
export function run(input) {
  // Check if the customer has the "ゴールド会員" tag
  const hasGoldMembership = input.cart.buyerIdentity.customer.hasTags.some(tagResponse => tagResponse.hasTag && tagResponse.tag === "ゴールド会員");

  if (!hasGoldMembership) {
    console.error("The customer does not have a gold membership.");
    return EMPTY_DISCOUNT;
  }

  // Define the target as the order subtotal
  const target = {
    orderSubtotal: {
      excludedVariantIds: []
    }
  };

  // The @shopify/shopify_function package applies JSON.stringify() to your function result
  // and writes it to STDOUT
  return {
    discounts: [
      {
        // Apply the discount to the order subtotal
        targets: [target],
        // Define a percentage-based discount
        value: {
          percentage: {
            value: "10.0"
          }
        }
      }
    ],
    discountApplicationStrategy: DiscountApplicationStrategy.First
  };
};