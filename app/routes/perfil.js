import Route from '@ember/routing/route';
import { inject as service } from '@ember/service';
import { hash } from 'rsvp';

const resolver = {
  hospitales: 'institution',
  elecciones: 'election',
  perfiles: 'profile'
};

/**
 * profile Route
 *
 * @class Route.profile
 */
export default Route.extend({
  resolver: resolver,

  /**
   * Spreadsheets Service
   *
   * @property spreadsheets
   * @type Service
   */
  spreadsheets: service(),

  /**
   * Routing Service
   *
   * @property _routing
   * @type Service
   */
  _routing: service('-routing'),



  /**
   * Model hook. Obtiene toda la información de un perfil según el id que obtiene de 'params'.
   *
   * @method model
   * @return {Object} Datos del perfil según el id. Algunos campos son: config, perfil, institucion, currentParty, profileGeneralInformationConfiguration, profiles, avaibleDocuments, dataTableGradation, totalGraduationScore, profileFunctions, entre otros.
   */
  model({ model, id}) {
    return this.store.findRecord(resolver[model], id).then((profile) => {
      return hash({
        config: {},
        profile: profile,
        compras: this.spreadsheets.fetch('compras').then((compras) => compras.filterBy('id', profile.id).map((compra) => {
          compra.Monto = parseFloat(compra.Monto.replace('Q','').replace(' ', '').replace(/,/g, ''));
          return compra;
        })),
        consultas: this.spreadsheets.fetch('consultas')
        // profiles: this.store.query('profile', {
        //   institution: profile.id
        // }),
        // elections: this.store.query('election', {
        //   institution: profile.id
        // }),
        // candidates: this.store.query('profile', {
        //   election: profile.id
        // }),
        // comissioners: this.store.query('profile', {
        //   comission: profile.id
        // }),
        // presupuesto: this.store.query('presupuesto', {
        //   institution: profile.id
        // })
      });
    });
  },

  /**
   * Acciones: didTransition.
   * @property actions
   * @type {Object}
   */
  actions: {
    didTransition() {
      window.scrollTo(0, 0);
    }
  }
});
