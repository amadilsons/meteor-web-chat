import { Accounts } from 'meteor/accounts-base';

Accounts.onCreateUser((options , user) => {
  _.extend(user, {
    online: true,
    contacts: []
  }); //add online status key to user doc

  return user;
});
