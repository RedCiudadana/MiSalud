import Component from '@ember/component';
import G6 from '@antv/g6';
import config from 'justiciapedia/config/environment';
import { A } from '@ember/array';
import { inject as service } from '@ember/service';

export default Component.extend({
  router: service(),

  classNames: ['d-flex', 'orgchart'],

  didRender() {
    this._super(...arguments);
    fetch(config.APP.staticFilesUrl + 'organigrama.json')
      .then((response) => {
        return response.json();
      })
      .then((puestos) => {
        let root = {
          name: 'Sector Justicia'
        };

        let parents = puestos.filterBy('parent', '');

        let buildTree = function(parent, list) {
          let children = list.filterBy('parent', parent.id);

          if (children.length) {
            parent.children = children;
          }

          A(list).removeObjects(children);
          children.forEach((parent) => buildTree(parent, list));

          return parent;
        };


        root.children = parents.map((parent) => buildTree(parent, puestos));

        const width = this.element.scrollWidth;
        const height = 600;

        const graph = new G6.TreeGraph({
          container: this.elementId,
          width,
          height,
          pixelRatio: 2,
          linkCenter: true,
          modes: {
            default: ['drag-canvas', 'zoom-canvas' ]
          },
          defaultNode: {
            size: 18,
            anchorPoints: [[ 0, 0.5 ], [ 1, 0.5 ]],
            style: {
              fill: '#C6E5FF',
              stroke: '#5B8FF9'
            }
          },
          defaultEdge: {
            shape: 'cubic-horizontal',
            style: {
              stroke: '#A3B1BF'
            }
          },
          layout: {
            type: 'compactBox',
            direction: 'LR',
            getId: function getId(d) {
              return d.id;
            },
            getHeight: function getHeight() {
              return 16;
            },
            getWidth: function getWidth() {
              return 16;
            },
            getVGap: function getVGap() {
              return 10;
            },
            getHGap: function getHGap() {
              return 100;
            }
          }
        });

        graph.node(function(node) {
          return {
            label: node.name,
            labelCfg: {
              offset: 10,
              position: node.children && node.children.length > 0 ? 'left' : 'right'
            }
          };
        });

        graph.data(root);

        graph.on('node:click', ev => {
          const node = ev.item;

          if (node._cfg.model) {
            // this.router.transitionTo('perfil', { model: 'instituciones', id: node._cfg.model.institutionId });
            this.router.transitionTo('perfil', 'instituciones', node._cfg.model.institutionId);
          }
        });

        graph.render();
        graph.fitView();
      });
  }
});
