import Component from "@ember/component";
import { A } from "@ember/array";

export default Component.extend({
  init({ model: { profile, profiles, elections, candidates } }) {
    this._super(...arguments);
    this.set(
      "links",
      A([])
    );

    this.set(
      "breadcrumbs",
      A([])
    );

    if (profile._internalModel.modelName === "institution") {
      this.links.pushObjects([
        {
          route: "perfil.index",
          img: "img/i-estrado.png",
          text: "Información general"
        },
        {
          route: "perfil.autoridades",
          img: "img/i-personas.png",
          text: "Autoridades",
          disabled: profiles.length < 1
        },
        {
          route: "perfil.elecciones",
          img: "img/i-personas.png",
          text: "Comisiones de Postulación",
          disabled: elections.length < 1
        }
      ]);
    }

    if (profile._internalModel.modelName === "profile") {
      this.links.pushObjects([
        {
          route: "perfil.index",
          img: "img/i-estrado.png",
          text: "Información general"
        }
      ]);
      this.breadcrumbs.pushObjects([
        {
          route: 'perfil',
          model: ['perfiles', profile.institution.id],
          text: profile.institution.nombre
        }
      ]);
    }

    if (profile._internalModel.modelName === "election") {
      this.links.pushObjects([
        {
          route: "perfil.index",
          img: "img/i-estrado.png",
          text: "Información general"
        },
        {
          route: "perfil.candidatos",
          img: "",
          text: "Candidatos",
          disabled: candidates.length < 1
        }
      ]);
    }
  }
});
