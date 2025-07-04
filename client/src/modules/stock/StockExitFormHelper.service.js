angular.module('opensigl.services')
  .service('StockExitFormHelperService', StockExitFormHelperService);

StockExitFormHelperService.$inject = [
  '$q', '$translate', 'PatientService', 'PatientInvoiceService', 'ServiceService',
];

/**
 * @class StockExitFormHelperService
 *
 * @description
 * This form powers the stock exit form in OpenSIGL.
 */
function StockExitFormHelperService($q, $translate, Patients, Invoices, Services) {
  const service = {};

  /**
   * @function getDescriptionForPatient
   *
   * @description
   * Fetches all the components to create a proper translation
   * for the stock exit to patient.
   *
   * @returns {Promise<String>} description
   */
  function getDescriptionForPatient(details, i18nKeys) {

    // load the required information for the patient description
    const queries = $q.all([
      Patients.read(details.entity_uuid),
      Invoices.read(details.invoice_uuid),
    ]);

    return queries
      .then(([patient, invoice]) => {

        Object.assign(i18nKeys, {
          patient : patient.display_name.concat(` (${patient.reference})`),
          invoice : invoice.reference,
        });

        return $translate.instant('STOCK.EXIT_PATIENT_WITH_INVOICE', i18nKeys);
      });
  }

  /**
   * @function getDescriptionForService
   *
   * @description
   * Fetches all the components to create a proper translation
   * for the stock exit to service.
   *
   * @returns {Promise<String>} description
   */
  function getDescriptionForService(details, i18nKeys) {
    // load the required information for the service description
    return Services.read(details.entity_uuid)
      .then(({ name }) => {

        Object.assign(i18nKeys, { service : name });

        return $translate.instant('STOCK.EXIT_SERVICE_ADVANCED', i18nKeys);
      });
  }

  // depots do not require any special translation
  // TODO(@jniles) - should this say "exit from depot X to depot Y of Z items"?
  function getDescriptionForDepot(details, i18nKeys) {
    return $q.resolve($translate.instant('STOCK.EXIT_DEPOT', i18nKeys));
  }

  // losses do not require any special translation
  // TODO(@jniles) - should this say "Loss of Z items from Depot Y"?
  function getDescriptionForLoss(details, i18nKeys) {
    return $q.resolve($translate.instant('STOCK.EXIT_LOSS', i18nKeys));
  }

  /**
   * @function getI18nKeys
   *
   * @description
   * Gets the i18nKeys to render the description.  Note, not all data is
   * cached on the client so this function is async, looking up data from
   * the server.
   *
   * It requires that an exit type be set before calling it.
   *
   * @returns {Promise<String>} description
   */
  service.getDescription = function getDescription(depot, details) {
    const i18nKeys = { depot : depot.text };

    let promise;

    switch (details.exit_type) {
    case 'patient':
      promise = getDescriptionForPatient(details, i18nKeys);
      break;
    case 'service':
      promise = getDescriptionForService(details, i18nKeys);
      break;
    case 'depot':
      promise = getDescriptionForDepot(details, i18nKeys);
      break;
    case 'loss':
      promise = getDescriptionForLoss(details, i18nKeys);
      break;
    default:
      throw new Error('Unrecognized Exit Type');
    }

    return promise
      .then(description => {
        if (details.description) {
          return description.concat(' - ', details.description);
        }
        return description;
      });
  };

  return service;
}
