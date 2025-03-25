import {
    getUserData,
    sendUserData,
    sendAvatarData,
    addNewCard
} from "./api.js";

import { createCard } from "./card.js";
import { enableValidation } from "./validate.js";
import { validationSettings } from "./constants.js";
import { openModal, closeModal, setCloseEventListeners } from "./modal.js";

import '../pages/index.css';

const placesList = document.querySelector('.places__list');

// Popups
const profilePopup = document.querySelector('.popup_type_edit');
const cardPopup = document.querySelector('.popup_type_new-card');
const avatarPopup = document.querySelector('.popup_type_avatar');

const popups = document.querySelectorAll('.popup');

// Buttons
const editProfileButton = document.querySelector('.profile__edit-button');
const addCardButton = document.querySelector('.profile__add-button');
const editAvatarButton = document.querySelector('.profile__avatar-edit');
const closeButtons = document.querySelectorAll('.popup__close');

// Profile
const profileTitle = document.querySelector('.profile__title');
const profileDescription = document.querySelector('.profile__description');
const profileAvatar = document.querySelector('.profile__image');

// Forms
const profileFormElement = profilePopup.querySelector('.popup__form');
const nameInput = profileFormElement.querySelector('.popup__input_type_name');
const jobInput = profileFormElement.querySelector('.popup__input_type_description');

const cardFormElement = cardPopup.querySelector('.popup__form');
const newCardName = cardPopup.querySelector('.popup__input_type_card-name');
const newCardLink = cardPopup.querySelector('.popup__input_type_url');

const avatarFormElement = avatarPopup.querySelector('.popup__form');
const avatarInput = avatarPopup.querySelector('.popup__input_type_url');

// ID current user
let userId;

popups.forEach(popup => {
    popup.classList.add('popup_is-animated');
});

setCloseEventListeners(closeButtons)

// Function to load user data
function loadUserData() {
    getUserData()
        .then(({ name, about, avatar, _id }) => {
            profileTitle.textContent = name;
            profileDescription.textContent = about;
            profileAvatar.src = avatar;
            userId = _id;
        })
        .catch(err => console.error("Ошибка загрузки данных пользователя:", err));
}

// Function to load no initial cards (or just yours if you want)
function loadInitialCards() {
    // You can either leave this empty to load no cards initially,
    // or just add your own cards if needed (e.g., from local storage or a default set)
    // This way no other user cards will be loaded.
    // Commenting out the API call so it doesn't load any cards.

    // getInitialCards()
    //     .then(cards => {
    //         cards.forEach(card => {
    //             const cardElement = createCard(card, userId);
    //             placesList.append(cardElement);
    //         });
    //     })
    //     .catch(err => console.error("Ошибка загрузки карточек:", err));
}

// Function to handle profile form submit
function handleProfileFormSubmit(evt) {
    evt.preventDefault();
    const username = nameInput.value;
    const description = jobInput.value;
    const submitButton = evt.target.querySelector('button');

    submitButton.textContent = "Сохранение...";
    submitButton.disabled = true;

    sendUserData({ username, description })
        .then(({ name, about }) => {
            profileTitle.textContent = name;
            profileDescription.textContent = about;
            closeModal(profilePopup);
        })
        .catch(err => console.error("Ошибка обновления профиля:", err))
        .finally(() => {
            submitButton.textContent = "Сохранить";
            submitButton.disabled = false;
        });
}

// Function to handle adding new card
function handleCardFormSubmit(evt) {
    evt.preventDefault();
    const name = newCardName.value;
    const link = newCardLink.value;
    const submitButton = evt.target.querySelector('button');

    submitButton.textContent = "Сохранение...";
    submitButton.disabled = true;

    addNewCard({ name, link })
        .then(card => {
            const cardElement = createCard(card, userId);
            placesList.prepend(cardElement);
            closeModal(cardPopup);
            cardFormElement.reset();
        })
        .catch(err => console.error("Ошибка добавления карточки:", err))
        .finally(() => {
            submitButton.textContent = "Сохранить";
            submitButton.disabled = false;
        });
}

// Function to handle avatar form submit
function handleAvatarFormSubmit(evt) {
    evt.preventDefault();
    const avatar = avatarInput.value;
    const submitButton = evt.target.querySelector('button');

    submitButton.textContent = "Сохранение...";
    submitButton.disabled = true;

    sendAvatarData({ avatar })
        .then(({ avatar }) => {
            profileAvatar.src = avatar;
            closeModal(avatarPopup);
            avatarFormElement.reset();
        })
        .catch(err => console.error("Ошибка изменения аватара:", err))
        .finally(() => {
            submitButton.textContent = "Сохранить";
            submitButton.disabled = false;
        });
}

// Set event listeners for buttons and forms
editProfileButton.addEventListener('click', () => {
    nameInput.value = profileTitle.textContent;
    jobInput.value = profileDescription.textContent;
    openModal(profilePopup);
});

profileFormElement.addEventListener('submit', handleProfileFormSubmit);

addCardButton.addEventListener('click', () => {
    openModal(cardPopup);
});

cardFormElement.addEventListener('submit', handleCardFormSubmit);

editAvatarButton.addEventListener('click', () => {
    openModal(avatarPopup);
});

avatarFormElement.addEventListener('submit', handleAvatarFormSubmit);

// Enable validation
enableValidation(validationSettings);

// Load user data and no initial cards
loadUserData();
loadInitialCards();  // No initial cards to load
