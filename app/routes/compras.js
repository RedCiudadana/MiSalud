import Route from '@ember/routing/route';
import { inject as service } from '@ember/service';
import { isBlank } from '@ember/utils';
import RSVP from 'rsvp';

export default Route.extend({
  spreadsheets: service(),

  queryParams: {
    page: { refreshModel: false },
    size: { refreshModel: false }
  },

  model() {
    return RSVP.hash({
      compras: this.spreadsheets.fetch('compras').then((compras) => compras.map((compra) => {
        compra.Monto = parseFloat(compra.Monto.replace('Q','').replace(' ', '').replace(/,/g, ''));
        compra['MES DE PUBLICACIÓN'] = compra['MES DE PUBLICACIÓN'].replace(/\s/g,'');
        compra['MES DE ADJUDICACIÓN'] = compra['MES DE ADJUDICACIÓN'].replace(/\s/g,'');
        compra['MES DE CIERRE RECEPCIÓN'] = compra['MES DE CIERRE RECEPCIÓN'].replace(/\s/g,'');

        return compra;
      })),
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
        valuePath: 'Monto',
        money: true
      }
    ]);

    // Charts
    let comprasModalidad = model.compras.mapBy('ModalidadLCE').uniq();

    let labels = [];
    let data = [];


    comprasModalidad.forEach((modalidad) => {
      // Agregar la etiqueta y el # de compras de esa modalidad
      if (isBlank(modalidad)) {
        return;
      }

      labels.push(modalidad);
      data.push(model.compras.filterBy('ModalidadLCE', modalidad).length);
    });

    let dataComprasByModalidad = {
      labels: labels,
      datasets: [{
        label: '# de compras',
        data: data,
        backgroundColor: [
          '#2e5765',
          '#2bb673',
          '#27aae1',
          '#0cab55',
          '#fab026',
          '#115870',
          '#24dd84',
          '#05b4fe',
          '#e99800'
        ],
        borderWidth: 1.5
      }]
    };

    controller.set('dataComprasByModalidad', dataComprasByModalidad);
    controller.set('optionsComprasByModalidad', {
			title: {
				display: true,
				text: 'Compras por modalidad'
      },
      legend: {
        display: true
      },
      tooltips: {
        enabled: true
      },
      responsive: true
    });

    let meses = ['Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio', 'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'];

    let vigentes = meses.map((mes) => {
      // return model.compras.filterBy('MES DE PUBLICACIÓN', mes).length;
      return model.compras.slice(0, 2).filter((compra) => {
        let mesActual = meses.indexOf(mes);
        let mesPublicacion = meses.indexOf(compra['MES DE PUBLICACIÓN']);
        let mesAdjudicacion = meses.indexOf(compra['MES DE ADJUDICACIÓN']);

        return mesPublicacion <= mesActual && ((mesAdjudicacion > mesActual))
      }).length;
    });

    let adjudicados = meses.map((mes) => {
      // return model.compras.filterBy('MES DE PUBLICACIÓN', mes).length;
      return model.compras.filter((compra) => {
        let mesActual = meses.indexOf(mes);
        let mesAdjudicacion = meses.indexOf(compra['MES DE ADJUDICACIÓN']);

        return mesAdjudicacion === mesActual;
      }).length;
    });

    let anulados = meses.map((mes) => {
      // return model.compras.filterBy('MES DE PUBLICACIÓN', mes).length;
      return model.compras.filter((compra) => {
        let mesActual = meses.indexOf(mes);

        let compraMesCierre = compra['MES DE CIERRE RECEPCIÓN'].toLowerCase().replace(/(?:^|\s|-|\/)\S/g, function(m) {
          return m.toUpperCase();
        });

        let mesCierre = meses.indexOf(compraMesCierre);


        return mesCierre === mesActual && compra['Estatus'] === 'Finalizado anulado';
      }).length;
    });

    let desierto = meses.map((mes) => {
      // return model.compras.filterBy('MES DE PUBLICACIÓN', mes).length;
      return model.compras.filter((compra) => {
        let mesActual = meses.indexOf(mes);

        let compraMesCierre = compra['MES DE CIERRE RECEPCIÓN'].toLowerCase().replace(/(?:^|\s|-|\/)\S/g, function(m) {
          return m.toUpperCase();
        });

        let mesCierre = meses.indexOf(compraMesCierre);


        return mesCierre === mesActual && compra['Estatus'] === 'Finalizado desierto';
      }).length;
    });

    controller.set('dataComprasStatusByMes', {
      labels: meses,
      datasets: [
        {
          label: 'Vigentes',
          backgroundColor: '#2bb673',
          data: vigentes
        },
        {
          label: 'Terminados Adjudicados',
          backgroundColor: '#27aae1',
          data: adjudicados
        },
        {
          label: 'Finalizados Anulados',
          backgroundColor: '#fab026',
          data: anulados
        },
        {
          label: 'Finalizados Desiertos',
          backgroundColor: '#e99800',
          data: desierto
        }
      ]
    });

    controller.set('optionsComprasStatusByMes', {
			title: {
				display: true,
				text: 'Estado de compras por mes'
			},
			tooltips: {
				mode: 'index',
				intersect: false
			},
			responsive: true,
			scales: {
				xAxes: [{
					stacked: true,
				}],
				yAxes: [{
					stacked: true
				}]
			}
		});
  },
});
