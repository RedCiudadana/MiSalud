import Controller from '@ember/controller';
import { computed } from '@ember/object';
import pagesNumbersByPage from 'misalud/utils/pagination/pagesNumbersByPage';

const array_chunks = (array, chunk_size) =>
  Array(Math.ceil(array.length / chunk_size))
    .fill()
    .map((_, index) => index * chunk_size)
    .map(begin => array.slice(begin, begin + chunk_size));

export default Controller.extend({
  page: 1,
  size: 10,

  currentSort: null,

  filteredData: computed('model', 'filterUnidad', 'filterModalidadLCE', 'filterEstatus', 'currentSort', function() {
    let compras = this.model.compras;

    if(this.currentSort) {
      if(this.currentSort.firstObject.isAscending) {
        compras = compras.sortBy(this.currentSort.firstObject.valuePath);
      } else {
        compras = compras.sortBy(this.currentSort.firstObject.valuePath).reverseObjects();
      }
    }

    if (
      this.filterUnidad === undefined
      && this.filterModalidadLCE === undefined
      && this.filterEstatus === undefined
    ) {
      return compras;
    }

    return compras.filter((compra) => {
      if (this.filterUnidad && compra.Unidad !== this.filterUnidad.Unidad) {
        return false;
      }

      if (this.filterModalidadLCE && compra.ModalidadLCE !== this.filterModalidadLCE.ModalidadLCE) {
        return false;
      }

      if (this.filterEstatus && compra.Estatus !== this.filterEstatus.Estatus) {
        return false;
      }

      return true;
    })
  }),

  FuenteCompras: computed('model', function() {
    return this.model.consultas.findBy('variable', 'FuenteCompras');
  }),

  FechaCompras: computed('model', function() {
    return this.model.consultas.findBy('variable', 'FechaCompras');
  }),

  DescargarExcel: computed('model', function() {
    return this.model.consultas.findBy('variable', 'DescargarExcel');
  }),

  DescargarPDF: computed('model', function() {
    return this.model.consultas.findBy('variable', 'DescargarPDF');
  }),


  montoTotal: computed('model', function() {
    return this.model.comprasresumen.findBy('variable', 'montoTotal');
  }),

  concursos: computed('model', function() {
    return this.model.comprasresumen.findBy('variable', 'concursos');
  }),

  concursosTerminados: computed('model', function() {
    return this.model.comprasresumen.findBy('variable', 'concursosTerminados');
  }),

  concursosVigente: computed('model', function() {
    return this.model.comprasresumen.findBy('variable', 'concursosVigente');
  }),


  UnidadOptions: computed('model', function() {
    return this.model.compras.uniqBy('Unidad');
  }),
    ModalidadLCEOptions: computed('model', function() {
    return this.model.compras.uniqBy('ModalidadLCE');
  }),
    EstatusOptions: computed('model', function() {
    return this.model.compras.uniqBy('Estatus');
  }),

  footCompras: computed('compras', function() {
    return [
      {
        Compras: 'Monto total',
        Monto: this.compras.filterBy('Estatus', 'Terminado adjudicado').mapBy('Monto').reduce((prev, current) => prev + current).toFixed(2)
      }
    ];
  }),

  chunks: computed('filteredData', function() {
    return array_chunks(this.filteredData, this.size);
  }),

  compras: computed('chunks', 'page', function() {
    return this.chunks[this.page - 1];
  }),

  pages: computed('chunks', 'page', function() {
    return pagesNumbersByPage(this.chunks.length, this.page);
  }),

  actions: {
    selectPage(page) {
      this.set('page', page);
    },

    prevPage() {
      this.set('page', this.page > 1 ? this.page - 1 : 1);
    },

    nextPage() {
      this.set('page', this.page < this.chunks.length ? this.page + 1 : this.chunks.length)
    },

    sortingUpdate(sort) {
      if(this.currentSort !== null && this.currentSort.firstObject.valuePath === sort.firstObject.valuePath) {
        sort.firstObject.isAscending = !this.currentSort.firstObject.isAscending;
      }

      this.set('currentSort', sort);
      this.set('page', 1);
    }
  }
});
