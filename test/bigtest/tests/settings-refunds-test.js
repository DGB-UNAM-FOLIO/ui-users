import { expect } from 'chai';

import {
  beforeEach,
  describe,
  it,
} from '@bigtest/mocha';

import setupApplication from '../helpers/setup-application';
import FeeFineInteractor from '../interactors/settings-feefine';

describe('Settings refunds', () => {
  setupApplication({ scenarios: ['settings-feefine'] });

  beforeEach(async function () {
    this.visit('/settings/users/refunds');
    await FeeFineInteractor.whenLoaded();
  });

  it('renders proper amount of rows', () => {
    expect(FeeFineInteractor.list.rowCount).to.equal(5);
  });

  it('renders proper amount of columns', () => {
    expect(FeeFineInteractor.list.rows(0).cellCount).to.equal(4);
  });

  it('renders proper values for the first row', () => {
    const firstRow = FeeFineInteractor.list.rows(0);
    expect(firstRow.cells(0).text).to.equal('Reason0');
    expect(firstRow.cells(1).text).to.equal('Reason Desc0');
  });

  describe('delete and cancel', () => {
    beforeEach(async () => {
      await FeeFineInteractor.list.rows(0).deleteButton.click();
      await FeeFineInteractor.confirmationModal.cancelButton.click();
    });

    it('renders proper amount of rows', () => {
      expect(FeeFineInteractor.list.rowCount).to.equal(5);
    });
  });

  describe('delete and confirm', () => {
    beforeEach(async () => {
      await FeeFineInteractor.list.rows(0).deleteButton.click();
      await FeeFineInteractor.confirmationModal.confirmButton.click();
    });

    it('renders proper amount of rows', () => {
      expect(FeeFineInteractor.list.rowCount).to.equal(4);
    });
  });

  describe('edit and cancel', () => {
    beforeEach(async () => {
      await FeeFineInteractor.list.rows(0).editButton.click();
      await FeeFineInteractor.list.rows(0).textfield(0).fillAndBlur('Reason10');
      await FeeFineInteractor.list.rows(0).textfield(1).fillAndBlur('Reason Desc10');
      await FeeFineInteractor.list.rows(0).cancelButton.click();
    });

    it('renders proper values after cancel', () => {
      const firstRow = FeeFineInteractor.list.rows(0);
      expect(firstRow.cells(0).text).to.equal('Reason0');
      expect(firstRow.cells(1).text).to.equal('Reason Desc0');
    });
  });

  describe('edit and save', () => {
    beforeEach(async () => {
      await FeeFineInteractor.list.rows(0).editButton.click();
      await FeeFineInteractor.list.rows(0).textfield(0).fillAndBlur('Reason10');
      await FeeFineInteractor.list.rows(0).textfield(1).fillAndBlur('Reason Desc10');
      await FeeFineInteractor.list.rows(0).saveButton.click();
    });

    it('renders proper values after edit', () => {
      const firstRow = FeeFineInteractor.list.rows(0);
      expect(firstRow.cells(0).text).to.equal('Reason10');
      expect(firstRow.cells(1).text).to.equal('Reason Desc10');
    });
  });

  describe('add a refund', () => {
    beforeEach(async () => {
      await FeeFineInteractor.newItemButton.click();
      await FeeFineInteractor.list.rows(0).textfield(0).fillAndBlur('Reason10');
      await FeeFineInteractor.list.rows(0).textfield(1).fillAndBlur('Reason Desc10');
      await FeeFineInteractor.list.rows(0).saveButton.click();
    });

    it('renders proper values after add', () => {
      const firstRow = FeeFineInteractor.list.rows(5);
      expect(firstRow.cells(0).text).to.equal('Reason10');
      expect(firstRow.cells(1).text).to.equal('Reason Desc10');
    });
  });

  describe('add an exist refund', () => {
    beforeEach(async () => {
      await FeeFineInteractor.newItemButton.click();
      await FeeFineInteractor.list.rows(0).textfield(0).fillAndBlur('Reason0');
      await FeeFineInteractor.list.rows(0).textfield(1).fillAndBlur('Reason0');
      await FeeFineInteractor.list.rows(0).cancelButton.click();
    });

    it('renders proper amount of rows', () => {
      expect(FeeFineInteractor.list.rowCount).to.equal(5);
    });
  });
});
