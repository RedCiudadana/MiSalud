import Route from '@ember/routing/route';
import { inject as service } from '@ember/service';
import RSVP from 'rsvp';

export default Route.extend({
  spreadsheets: service(),

  model() {
    return RSVP.hash({
      compras: this.spreadsheets.fetch('compras'),
      comprasresumen: this.spreadsheets.fetch('comprasresumen'),
      consultas: this.spreadsheets.fetch('consultas')
    });
  },

  setupController(controller, model) {
    this._super(controller, model);
    controller.set('columnsCompras', [
      {
        name: 'Unidad',
        valuePath: 'Unidad'
      },
      {
        name: 'Compras',
        valuePath: 'Compras'
      },
      {
        name: 'ModalidadLCE',
        valuePath: 'ModalidadLCE'
      },
      {
        name: 'Fecha',
        valuePath: 'Fecha'
      },
      {
        name: 'Estatus',
        valuePath: 'Estatus'
      },
      {
        name: 'Monto',
        valuePath: 'Monto'
      }
    ]);

    controller.set('FuenteCompras', model.consultas.findBy('variable', 'FuenteCompras'));
    controller.set('FechaCompras', model.consultas.findBy('variable', 'FechaCompras'));
    controller.set('DescargarExcel', model.consultas.findBy('variable', 'DescargarExcel'));
    controller.set('DescargarPDF', model.consultas.findBy('variable', 'DescargarPDF'));

    controller.set('montoTotal', model.comprasresumen.findBy('variable', 'montoTotal'));
    controller.set('concursos', model.comprasresumen.findBy('variable', 'concursos'));
    controller.set('concursosTerminados', model.comprasresumen.findBy('variable', 'concursosTerminados'));
  },
});
