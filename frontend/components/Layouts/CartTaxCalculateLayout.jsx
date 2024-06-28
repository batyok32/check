"use client";
import { useAppDispatch, useAppSelector } from "@/redux/hooks";
import {
    selectCartItems,
    selectCartItemsTotal,
    selectCartItemsShippingTotal,
} from "@/redux/selectors/cart";
import React, { useEffect } from "react";
import countries from "../utils/countries";
import { addToCart, setLastSeenData } from "@/redux/features/cartSlice";
import { getTaxRatesForProducts } from "@/redux/actions/shopActions";
import addProductToCartGlobalFn from "@/redux/utils/product";

const mapState = (state) => ({
    cartItems: selectCartItems(state),
    chosenAddress: state.addressBook.chosenAddress,
    lastCartItemAmount: state.cart.lastCartItemAmount,
    lastChosenAddress: state.cart.lastChosenAddress,
});

export default function CartTaxCalculateLayout() {
    const { cartItems, chosenAddress, lastCartItemAmount, lastChosenAddress } =
        useAppSelector(mapState);
    const dispatch = useAppDispatch();

    const fetchTaxPrices = () => {
        dispatch(
            setLastSeenData({
                amount: cartItems.length,
                address: chosenAddress,
            })
        );
        const extractedData = cartItems.map((cartItem) => ({
            product_id: cartItem.product.id,
            from_country: countries.find(
                (country) =>
                    country.name === cartItem.product.shipping_address.country
            )?.code,
            from_state: cartItem.product.shipping_address.state,
            to_country: countries.find(
                (country) => country.name === chosenAddress?.country
            )?.code,
            to_state: chosenAddress?.state,
        }));

        dispatch(getTaxRatesForProducts({ items: extractedData })).then(
            (res) => {
                if (res?.status > 205) {
                    const updatedCartItems = cartItems.map((cartItem) => ({
                        ...cartItem,
                        tax_rate: 0,
                    }));
                    updatedCartItems.map((locItem) => {
                        dispatch(addToCart(locItem));
                    });
                } else {
                    for (
                        let index = 0;
                        index < res.data["items"].length;
                        index++
                    ) {
                        const item = res.data["items"][index];
                        console.log("ITEM", item);
                        let locItems = cartItems.filter(
                            (cartItem) =>
                                cartItem.product.id === item.product_id
                        );
                        console.log("LOC ITEMS", locItems);
                        locItems.map((locItem) => {
                            dispatch(
                                addToCart({
                                    ...locItem,
                                    tax_rate: item.tax_rate,
                                })
                            );
                        });
                    }
                }
            }
        );
    };
    useEffect(() => {
        if (lastCartItemAmount !== cartItems.length) {
            fetchTaxPrices();
        } else if (chosenAddress?.id !== lastChosenAddress?.id) {
            fetchTaxPrices();
        }
    }, [cartItems, chosenAddress]);

    // Get cart items
    // If cart items more than 0
    // and shipping address present
    // change all state inputs to select one if country is us
    // give validation for address add in sellers and update
    // reformate state to 2 letters and
    // send get request for taxes with list of cart items and shipping address
    // change state to loading
    // and dont give to checkout without success state
    // got response with rates -> set cartitems rates, and total_tax_amount=rate*quantity
    // and everytime amount changes, recalculate total_tax_amount
    // in cart and checkout make loading if state loading and if not loading show taxes
    // after checkout send  order with tax_amounts
    // after that we need to add function to add card and save cards

    // after that we need to get payments and whenever order is created create payment
    // create payment history or ClientTransaction
    // which includes total tax amount, total shipping amount, total orderitem count, total orderitem price amount, orderid, payment id
    // show order item payment history to seller and client

    // but for seller dont show tax and shipping, but add and remove peyda 10%
    // and whenever seller clicks payment history in orderitem
    // he will be redirected to page where he could see operation amount where item price, itemprice*quantity, -10%, total seller will get

    // and everytime product is added he will see box where it says that YuuSell collects 10% of product price
    // so if you want you can update product prices automatically by clicking grow 10% button
    // after order item is set seller hold balance will grow on total_with_fees_taken
    // and after order item is delivered seller available balance will grow on that price and will be removed for total_with_fees_taken

    // tracking will go as a get request with celery beats every 12 hours and will take all orderitems which states are shipped
    // if shipper is Easyship send get request for easyship with shipping id, if state is intransfered or delivered, and state of orderitem is not same update state
    // if shipper is Yuusell check if it was in warehouse or not, if not send again get request for easyship with shipping id, if state is intransfered or delivered, and state of orderitem is not same update state
    // for example if orderitem state is shipped and wasnt in warehous yet and tracking says that it is delivered set orderitem state to inwarehouse
    // if was in warehouse we need to send get request to shipping platform but right now we dont have so we wait
    // after that seller will be able to withdraw money that he has on available balance, we will create sendPayment in sendbox
    // create sellertransaction that will show it
    // it creates celery beats that will fetch all order items which state is delivered and is not closed and checks if delivery date is more than 1 week
    // if yes so sends seller money from hold to available, creating by that sellertransaction
    // and marks an order closed

    // Account page filters
    // Open modal and list what filters are available
    // Finances page client
    // Cards list delete add page

    // check everything on mobile responsivness
    // deploy

    // Refund
    // Seller creates return policy for products
    // Return policy can be: no refunds, refunds but within 7 days and pays seller, refunds but within 7 days and pays client

    // If order is placed and client passed cancel form and cancel requested,
    // seller recieves email for order cancelling
    // seller needs to accept or decline cancel
    // if accepts cancel client recieves full refund with taxes and full amount
    // if label is bought, label also is refunded,
    // creates transaction history refunded in sellers
    // creates transaction that refunded in client history
    // creates transaction that refunded in shipping transaction
    // seller on_hold balance reduces
    // order is marked as closed and cancelled
    // client recieves an email

    // if cancelled request
    // client recieves email that cancel is not made and client will need to wait until order is delivered

    // order is delivered, depending on refund policy client can cancel order
    // meaning if no refund, refund wont be visible,
    // if refund and seller pays, client will pass refund request form and will be cancel requested
    // and after that will have availability to get labels for product
    //// that will create sellerhistory type="Refund labels are bought" with reference id and amount
    //// that will decrease on_hold balance if possible if not it will decrease available_balance
    //// if not possible available_balance
    //// seller will receive an email that account is on hold and support will receive an email to check that account
    //// client wont be able to make refund will have popup to contact support for that issue
    //// if order is yuusell shipped, charge by yuusell pays
    // and after that buy refund labels for labels that were last and came to client
    // seller will receive an email where saying that he can see his labels for refund
    // he will see that we ask them to put in the same size boxes for that labels
    // he could print that labels, refund order will be marked as shipped
    // if it is yuusell shipping it will come to the warehouse
    // it will have tracking too, that will check all refund items that are in shipped and will send get request
    // if it is yuusell shipping mark as came to warehouse  if tracking says it is delivered if it hasnt wasinwarehouse state else set state delivered
    // if it is easyship shipping mark as delivered
    // send email to seller and client that this order item full refunded

    // if client pays for refund
    // seller will not be charged for refund and client will need to pay for refund
    // client will have page to buy label
    // where he will have price for refund labels and able to pay by card
    // if it is yuusell shipping made he will need to buy label to yuusell warehouse
    // with shipping options from yuusell
    // else he will neeed to buy labels from easyship with calculated prices
    // Client buys labels he will receive email that he bought labels for refund
    // Will create refund transaction
    // and after that buy refund labels for labels that were last and came to client
    // seller will receive an email where saying that he can see his labels for refund
    // he will see that we ask them to put in the same size boxes for that labels
    // he could print that labels, refund order will be marked as shipped
    // if it is yuusell shipping it will come to the warehouse
    // it will have tracking too, that will check all refund items that are in shipped and will send get request
    // if it is yuusell shipping mark as came to warehouse  if tracking says it is delivered if it hasnt wasinwarehouse state else set state delivered
    // if it is easyship shipping mark as delivered
    // send email to seller and client that this order item full refunded

    return <div></div>;
}
