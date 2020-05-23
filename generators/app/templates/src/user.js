/**
 * A UserTypes enumarator for specifing a user type
 * @type {{paying: string, registered: string, anonymous: string}}
 */
export const UserTypes = {
  paying: 'paying',
  registered: 'registered',
  anonymous: 'anonymous',
};
/**
 * An object that represents a user instance
 * Must be constructed with an explicit type:
 *
 */
export default class User {
  constructor(userOptions) {
    if (!userOptions) {
      throw new Error('Required parameter missing: userOptions');
    }
    if (!userOptions.type) {
      throw new Error('Required parameter missing: userOptions.type');
    }
    // if (!userOptions.anonymousId) {
    //   throw new Error('Required parameter missing: userOptions.anonymousId');
    // }
    this.type = userOptions.type;
    if (this.type === UserTypes.anonymous) {
      this.anonymousId = userOptions.anonymousId || null;
    }
    else if (
      this.type === UserTypes.registered
      || this.type === UserTypes.paying
    ) {
      this.anonymousId = userOptions.anonymousId;
      this.id = userOptions.userId;
      this.email = userOptions.userName;
      this.firstName = userOptions.firstName;
      this.lastName = userOptions.lastName;
      this.emailStatus = userOptions.emailValidity;
      this.token = userOptions.ticketId;
      this.university = userOptions.university === 'true';
    }
    else {
      throw new Error('Unsupported User Type');
    }
    /* this.premiumArticlesCount =
    (cookieAsMap.get('HtzRusr') ?
    parseInt(cookieAsMap.get('HtzRusr'), 10) : -1); */
  }
}
