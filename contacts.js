const fs = require('fs').promises; // асинхронные методы работы с фс .promises - возвращает промисофикованные версии методов
const { v4: uuid } = require('uuid');
const path = require('path');

// // IIFE - фунция которая сама себя вызывает
// (async () => {
//     try {
//         /*
//             WINDOWS  C:\\project\qwe.json
//             UNIX  /home/src/qwe.json

//             path.join - оптимизует
//             path.resolve - ищет
//         */

//         // const pathToFile = path.join('contacts.js');
//         const pathToFile = path.resolve('./db/contacts.json');
//         const readResult = await fs.readFile(pathToFile); // получаем бинарник
//         const result = readResult.toString(); // преобразуем в строку
//         // console.log(result);

//     } catch (error) {
//         console.warn(error)
//     }
// })();


/*
 * Uncomment and write down the value
 * const contactsPath = ;
 */

// node index.js -a list
const contactsPath = path.join('db', 'contacts.json');

async function listContacts(dontConsole) {
    try {
        const result = await fs.readFile(contactsPath);
        const txtRes = JSON.parse(result);
        if (!dontConsole) { console.table(txtRes) };
        return txtRes;
    } catch (error) {
        console.warn(error);
    }
}

// node index.js -a get -i <contactId>
async function getContactById(contactId) {
    if (!contactId) {
        console.log('Please insert contact id by flag -id <id>')
        return;
    }
    try {
        const contacts = await listContacts(true);
        const searchedContact = contacts.find(el => el.id === contactId);
        if (searchedContact) { console.log(searchedContact); }
        else { console.log(`Contact with id ${contactId} is not exist`); }
        return searchedContact;
    } catch (error) {
        console.warn(error);
    }
}

// node index.js -a remove -i <contactId>
async function removeContact(contactId) {
    if (!contactId) {
        console.log('Please insert contact id by flag -id <id>')
        return;
    }
    const contactsList = await listContacts(true);
    const deleteIndex = contactsList.findIndex(el => el.id === contactId)
    const contactsListAfter = contactsList.splice(deleteIndex, 1);
    fs.writeFile(contactsPath, JSON.stringify(contactsListAfter))
    console.log(`Contact id=${contactId} was deleted`);

    return contactsListAfter;
}

// node index.js -a add -n <contactName> -e <contactEmail> -p <contactPhone>
async function addContact(name, email, phone) {
    const newContact = {
        id: uuid(),
        name,
        email,
        phone,
    };
    try {
        const contactsBefore = await listContacts(true);
        const contactsAfter = [...contactsBefore, newContact];
        fs.writeFile(contactsPath, JSON.stringify(contactsAfter));
        console.log('New contact added to phonebook');
        console.table(newContact);
        return contactsAfter;
    } catch (err) {
        console.error(err);
    }
}

module.exports = {
    listContacts,
    getContactById,
    removeContact,
    addContact,
};