import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    currentSection: 1,
    sections: {
        1: { data: null, isCompleted: false },
        2: { data: null, isCompleted: false },
        3: { data: null, isCompleted: false },
        4: { data: null, isCompleted: false },
    },

    seller_data: {
        seller_profile: null,
        addresses: null,
        contact_people: null,
    },
};

const updateNestedData = (state, type, data) => {
    // Ensure state.seller_data is an object
    if (!state.seller_data || typeof state.seller_data !== "object") {
        // Initialize state.seller_data with the 'type' key
        state.seller_data = {
            [type]: data, // Set the initial value for this 'type' to the provided 'data'
        };
    } else {
        // If state.seller_data exists and is an object, proceed with the normal logic
        const currentState = state.seller_data[type];

        if (currentState !== undefined) {
            state.seller_data[type] = { ...currentState, ...data };
        } else {
            state.seller_data[type] = data;
        }
    }
};

const sellerRegisterSlice = createSlice({
    name: "sellerReg",
    initialState,
    reducers: {
        updateSectionData: (state, action) => {
            const { section, data } = action.payload;
            state.sections[section].data = data;
            state.sections[section].isCompleted = true;
            if (section < 4) {
                state.currentSection = section + 1;
            }
        },
        goBackSection: (state) => {
            state.currentSection > 1
                ? (state.currentSection = state.currentSection - 1)
                : state.currentSection;
        },
        updateSellerData: (state, action) => {
            const { type, data } = action.payload;
            const validTypes = [
                "seller_profile",
                "addresses",
                "contact_people",
            ];
            if (validTypes.includes(type)) {
                console.log("UPDATING NESTED DATA", state, type, data);
                updateNestedData(state, type, data);
            } else {
                console.log("NOT VALID TYPE ", type);
                // Handle unknown type
                // Consider logging or setting an error state.
            }
        },
        flushBusinessRegistrationData: (state) => {
            // Resetting sections
            Object.keys(initialState.sections).forEach((key) => {
                state.sections[key] = initialState.sections[key];
            });

            // Resetting currentSection
            state.currentSection = initialState.currentSection;

            // Resetting seller_data
            Object.keys(initialState.seller_data).forEach((key) => {
                state.seller_data[key] = initialState.seller_data[key];
            });
        },
    },
});

export const {
    updateSectionData,
    goBackSection,
    updateSellerData,
    flushBusinessRegistrationData,
} = sellerRegisterSlice.actions;
export default sellerRegisterSlice.reducer;
