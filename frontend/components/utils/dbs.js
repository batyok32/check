export const lengthMeasuringUnits = [
    { name: "Centimeters", code: "cm" },
    { name: "Meters", code: "m" },
    { name: "Inches", code: "in" },
];

export const weightMeasuringUnits = [
    { name: "Kilograms", code: "kg" },
    { name: "Grams", code: "g" },
    { name: "Pounds", code: "lb" },
    { name: "Ounces", code: "oz" },
];

export const standardBoxSizes = [
    {
        name: "Small Box",
        dimensions: [
            { unit: "cm", height: 22.86, length: 30.48, width: 22.86 },
            { unit: "m", height: 0.22, length: 0.3, width: 0.22 },
            { unit: "in", height: 9, length: 12, width: 9 },
        ],
    },
    {
        name: "Medium Box",
        dimensions: [
            { unit: "cm", height: 30.48, length: 40.64, width: 30.48 },
            { unit: "m", height: 0.3, length: 0.4, width: 0.3 },
            { unit: "in", height: 12, length: 16, width: 12 },
        ],
    },
    {
        name: "Large Box",
        dimensions: [
            { unit: "cm", height: 50.8, length: 50.8, width: 50.8 },
            { unit: "m", height: 0.5, length: 0.5, width: 0.5 },
            { unit: "in", height: 20, length: 20, width: 20 },
        ],
    },
    {
        name: "Extra Large Box",
        dimensions: [
            { unit: "cm", height: 60.96, length: 60.96, width: 60.96 },
            { unit: "m", height: 0.6, length: 0.6, width: 0.6 },
            { unit: "in", height: 24, length: 24, width: 24 },
        ],
    },
];
export const containerRecommendations = [
    {
        name: "Standard 20-Foot Container ",
        dimensions: [
            { unit: "m", height: 2.59, length: 6.06, width: 2.44 },
            {
                unit: "kg",
                maxGrossWeight: 24000,
                tareWeight: 2300,
                payloadCapacity: 21700,
            },
        ],
        image: "https://www.oceanboxcontainers.com/wp-content/uploads/2022/06/20ft-shipping-container-Mockup-only.jpg",
    },
    {
        name: "Standard 40-Foot Container",
        dimensions: [
            { unit: "m", height: 2.59, length: 12.19, width: 2.44 },
            {
                unit: "kg",
                maxGrossWeight: 30480,
                tareWeight: 3700,
                payloadCapacity: 26780,
            },
        ],
        image: "https://www.oceanboxcontainers.com/wp-content/uploads/2022/06/20ft-shipping-container-Mockup-only.jpg",
    },
    {
        name: "High Cube 40-Foot Container",
        dimensions: [
            { unit: "m", height: 2.9, length: 12.19, width: 2.44 },
            {
                unit: "kg",
                maxGrossWeight: 30480,
                tareWeight: 3900,
                payloadCapacity: 26580,
            },
        ],
        image: "https://www.oceanboxcontainers.com/wp-content/uploads/2022/06/20ft-shipping-container-Mockup-only.jpg",
    },
    {
        name: "Open Top 20-Foot Container",
        dimensions: [
            { unit: "m", height: 2.59, length: 6.06, width: 2.44 },
            {
                unit: "kg",
                maxGrossWeight: 24000,
                tareWeight: 2350,
                payloadCapacity: 21650,
            },
        ],
        image: "https://www.oceanboxcontainers.com/wp-content/uploads/2022/06/20ft-shipping-container-Mockup-only.jpg",
    },
    {
        name: "Refrigerated 20-Foot Container",
        dimensions: [
            { unit: "m", height: 2.59, length: 6.06, width: 2.44 },
            {
                unit: "kg",
                maxGrossWeight: 27000,
                tareWeight: 3000,
                payloadCapacity: 24000,
            },
        ],
        image: "https://www.oceanboxcontainers.com/wp-content/uploads/2022/06/20ft-shipping-container-Mockup-only.jpg",
    },
    {
        name: "Flat Rack 20-Foot Container",
        dimensions: [
            { unit: "m", height: 2.59, length: 6.06, width: 2.44 },
            {
                unit: "kg",
                maxGrossWeight: 24000,
                tareWeight: 2500,
                payloadCapacity: 21500,
            },
        ],
        image: "https://www.oceanboxcontainers.com/wp-content/uploads/2022/06/20ft-shipping-container-Mockup-only.jpg",
    },
];
