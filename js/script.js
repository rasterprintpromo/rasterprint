let descriptions = {};

const modal =
document.getElementById("modal");

const title =
document.getElementById("title");

const serviceIcon =
document.getElementById("serviceIcon");

const faqContainer =
document.getElementById("faqContainer");


async function init() {


try {

    const response =
        await fetch(
            "./assets/descriptions.json"
        );

    descriptions =
        await response.json();

    populateCards();

    attachCardEvents();

    const productsResponse =
    await fetch(
        "./assets/products.json"
    );

    const products =
        await productsResponse.json();

    renderProducts(products);

} catch (error) {

    console.error(
        "Greška kod učitavanja JSON-a:",
        error
    );
}


}

function renderProducts(products){

    const container =
        document.getElementById(
            "productsGrid"
        );

    container.innerHTML = "";

    Object.entries(products)
        .forEach(
            ([product, services]) => {

        const card =
            document.createElement(
                "div"
            );

        card.className =
            "product-card";

        const links =
            services.map(service => {

            return `
                <span
                    class="product-link"
                    data-service="${service}"
                >
                    ${service}
                </span>
            `;

        }).join("");

        card.innerHTML = `
            <div class="product-title">
                ${product}
            </div>

            <div class="product-services">
                ${links}
            </div>
        `;

        container.appendChild(card);
    });

    bindProductLinks();
}

function bindProductLinks(){

    document
        .querySelectorAll(
            ".product-link"
        )
        .forEach(link => {

        link.addEventListener(
            "click",
            () => {

                const serviceName =
                    link.dataset.service;

                const service =
                    descriptions[
                        serviceName
                    ];

                if(service){

                    openModal(service);
                }
            }
        );
    });
}


function populateCards() {


document
    .querySelectorAll(".card")
    .forEach(card => {

        const key =
            card.dataset.key;

        const service =
            descriptions[key];

        if (!service) {

            console.warn(
                "Nema podataka za:",
                key
            );

            return;
        }

        const titleEl =
            card.querySelector(
                ".card-title"
            );

        const descriptionEl =
            card.querySelector(
                ".card-description"
            );

        const iconEl =
            card.querySelector(
                ".card-icon"
            );

        titleEl.textContent =
            service.name || "";

        descriptionEl.textContent =
            service.description || "";

        iconEl.src =
            service.icon || "";

        iconEl.alt =
            service.name || "";

        if (service.color) {

            titleEl.style.color =
                service.color;
        }
    });


}

function attachCardEvents() {


document
    .querySelectorAll(".card")
    .forEach(card => {

        card.addEventListener(
            "click",
            () => {

                const key =
                    card.dataset.key;

                const service =
                    descriptions[key];

                if (!service) {

                    console.error(
                        "Service not found:",
                        key
                    );

                    return;
                }

                openModal(service);
            }
        );
    });


}

function openModal(service) {


title.textContent =
    service.name || "";

title.style.color =
    service.color || "#ffffff";

serviceIcon.src =
    service.icon || "";

serviceIcon.alt =
    service.name || "";

faqContainer.innerHTML = "";

if (
    service.faq &&
    service.faq.length
) {

    service.faq.forEach(item => {

        faqContainer.innerHTML += `
            <div class="faq-item">

                <div class="faq-question">
                    ${item.question}
                </div>

                <div class="faq-answer">
                    ${item.answer}
                </div>

            </div>
        `;
    });

} else {

    faqContainer.innerHTML = `
        <div class="faq-answer">
            Trenutno nema dodatnih informacija.
        </div>
    `;
}

modal.classList.add(
    "active"
);


}

function closeModal() {


modal.classList.remove(
    "active"
);


}

document
.getElementById("close")
.addEventListener(
"click",
closeModal
);

window.addEventListener(
"click",
e => {


    if (
        e.target === modal
    ) {

        closeModal();
    }
}


);

init();
