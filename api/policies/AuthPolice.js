const { MessageService } = cano.app.services;

class AuthPolice {

  async apikey({ request, res }, next) {
    await next();
  }

}

module.exports = AuthPolice;
