import CRUD from './route';

enum Role {
    admin,
    staff,
    volunteer,
    customer
}

const testData = {
    firstName: "Daniel",   
    lastName: "Jakab",
    pronouns: "he/him",   
    username: "danieljakab",   
    email: "daniel.jakab@tufts.edu",  
    role: Role.admin,
    phoneNumber: "1234567890",
    password: "1234567890"

};

CRUD.POST(testData);
