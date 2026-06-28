const { Op } = require('sequelize');
const { TokenRevocado } = require('../models');

class TokenRevocadoRepository {
  async revocar(tokenHash, usuarioId, expiraEn) {
    return await TokenRevocado.create({ tokenHash, usuarioId, expiraEn });
  }

  async existe(tokenHash) {
    const registro = await TokenRevocado.findOne({ where: { tokenHash } });
    return !!registro;
  }

  async limpiarExpirados() {
    return await TokenRevocado.destroy({
      where: { expiraEn: { [Op.lt]: new Date() } },
    });
  }
}

module.exports = new TokenRevocadoRepository();