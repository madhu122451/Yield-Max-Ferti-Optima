document.addEventListener("DOMContentLoaded", function () {
    const fertilizers = [
        { name: "Urea", type: "Nitrogen", price: 450.00, availability: "Available" },
        { name: "DAP", type: "Phosphorus", price: 1350.00, availability: "Available" },
        { name: "MOP", type: "Potassium", price: 750.00, availability: "Out of Stock" },
        { name: "NPK 20-20-20", type: "Balanced", price: 1600.00, availability: "Available" },
        { name: "Zinc Sulphate", type: "Micronutrient", price: 400.00, availability: "Limited Stock" }
    ];

    function renderFertilizers() {
        const container = document.getElementById("fertilizer-list");
        container.innerHTML = "";

        fertilizers.forEach(fertilizer => {
            const card = document.createElement("div");
            card.className = "fertilizer-card";
            card.innerHTML = `
                <h3>${fertilizer.name}</h3>
                <p>Type: ${fertilizer.type}</p>
                <p>Price: ₹${fertilizer.price.toFixed(2)}</p>
                <p>Status: <strong>${fertilizer.availability}</strong></p>
                ${fertilizer.availability === "Available" ? `<button>Add to Cart</button>` : `<p style="color:red;">Out of Stock</p>`}
            `;
            container.appendChild(card);
        });
    }

    function sortBy(criteria) {
        fertilizers.sort((a, b) => (a[criteria] > b[criteria] ? 1 : -1));
        renderFertilizers();
    }

    renderFertilizers();
});
