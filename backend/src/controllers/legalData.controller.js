import { documentStore } from '../../services/documentStore.js';

export const legalDataController = {
  getStatutes(req, res, next) {
    try {
      res.json({
        success: true,
        count: documentStore.statutes.length,
        statutes: documentStore.statutes
      });
    } catch (err) {
      next(err);
    }
  },

  getPrecedents(req, res, next) {
    try {
      res.json({
        success: true,
        count: documentStore.precedents.length,
        precedents: documentStore.precedents
      });
    } catch (err) {
      next(err);
    }
  }
};
