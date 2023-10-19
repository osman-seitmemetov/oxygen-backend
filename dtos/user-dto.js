module.exports = class UserDto {
    email;
    id;
    isActivated;
    phone;
    firstname;
    lastname;
    birthday;
    gender;
    role;

    constructor(model) {
        this.email = model.email;
        this.id = model.id;
        this.isActivated = model.isActivated;
        this.phone = model.phone;
        this.firstname = model.firstname;
        this.lastname = model.lastname;
        this.birthday = model.birthday;
        this.gender = model.gender;
        this.role = model.role;
    }
}
