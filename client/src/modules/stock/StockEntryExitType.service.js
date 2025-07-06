angular.module('opensigl.services')
  .service('StockEntryExitTypeService', StockEntryExitTypeService);

StockEntryExitTypeService.$inject = ['StockModalService', '$q'];

function StockEntryExitTypeService(StockModal, $q) {
  const service = this;

  service.exitTypes = [{
    icon : 'bi bi-person-raised-hand',
    label : 'patient',
    labelKey : 'PATIENT_REG.ENTITY',
    descriptionKey : 'STOCK.PATIENT_DISTRIBUTION',
    allowedKey : 'allow_exit_debtor',
    callback : findPatientCallback,
    formatLabel : (entity) => `${entity.reference} - ${entity.display_name}`,
  }, {
    icon : 'bi bi-house',
    label : 'service',
    labelKey : 'SERVICE.ENTITY',
    descriptionKey : 'STOCK.SERVICE_DISTRIBUTION',
    allowedKey : 'allow_exit_service',
    callback : findServiceCallback,
    formatLabel : (entity) => entity.name,
  }, {
    icon : 'bi bi-building',
    label : 'depot',
    labelKey : 'DEPOT.ENTITY',
    descriptionKey : 'STOCK.DEPOT_DISTRIBUTION',
    allowedKey : 'allow_exit_transfer',
    callback : findDepotCallback,
    formatLabel : (entity) => entity.text,
  }, {
    icon : 'bi bi-box-arrow-in-right',
    label : 'loss',
    labelKey : 'STOCK.EXIT_LOSS',
    descriptionKey : 'STOCK.LOSS_DISTRIBUTION',
    allowedKey : 'allow_exit_loss',
    callback : configureLossCallback,
    formatLabel : () => 'STOCK.LOSS_DISTRIBUTION',
  }];

  service.entryTypes = [{
    icon : 'bi bi-cash-stack',
    label : 'purchase',
    labelKey : 'STOCK.ENTRY_PURCHASE',
    descriptionKey : 'STOCK_FLUX.FROM_PURCHASE',
    allowedKey : 'allow_entry_purchase',
  }, {
    icon : 'bi bi-box-arrow-in-down-left',
    label : 'integration',
    labelKey : 'STOCK.INTEGRATION',
    descriptionKey : 'STOCK_FLUX.FROM_INTEGRATION',
    allowedKey : 'allow_entry_integration',
  }, {
    icon : 'bi bi-bag-heart',
    label : 'donation',
    labelKey : 'STOCK.DONATION',
    descriptionKey : 'STOCK_FLUX.FROM_DONATION',
    allowedKey : 'allow_entry_donation',
  }, {
    icon : 'bi bi-truck',
    label : 'transfer_reception',
    labelKey : 'STOCK.RECEPTION_TRANSFER',
    descriptionKey : 'STOCK_FLUX.FROM_TRANSFER',
    allowedKey : 'allow_entry_transfer',
  }];

  function findPatientCallback(depot, entityUuid) {
    return StockModal.openFindPatient({ entity_uuid : entityUuid });
  }

  function findServiceCallback(depot, entityUuid) {
    return StockModal.openFindService({ depot, entity_uuid : entityUuid });
  }

  function findDepotCallback(depot, entityUuid) {
    return StockModal.openFindDepot({ depot, entity_uuid : entityUuid });
  }

  function configureLossCallback() {
    return $q.resolve({ type : 'loss' });
  }
}
