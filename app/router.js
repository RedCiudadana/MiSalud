import EmberRouter from '@ember/routing/router';
import config from './config/environment';

export default class Router extends EmberRouter {
  location = config.locationType;
  rootURL = config.rootURL;
}

Router.map(function() {
  /**
   * Perfil ya sea de una institución o persona carga información dependiendo de eso. Es decir la ruta 'perfil' es el mismo para los dos.
   * Las subrutas en cambia varian según el modelo (institución o persona) y deberian detener la transición si se trata de ingresar a una ruta con un modelo inválido.
   */
  this.route('index', { path: '/' });
  this.route('perfil', { path: '/:model/:id' }, function() {
    this.route('autoridades');
    this.route('candidatos');
    this.route('elecciones');
    this.route('comisionados');
  });

  this.route('perfiles', { path: '/:model'});
  this.route('abastecimiento');
  this.route('compras');
  this.route('necesidades');
  this.route('priorizacion');
  this.route('presupuesto');
  this.route('preguntas');
  this.route('denuncias');
  this.route('embed-compras');
});
