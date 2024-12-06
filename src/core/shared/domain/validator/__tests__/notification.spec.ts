import { Notification } from '@core/shared/domain/validator/notification';

describe('Notification Unit Tests', () => {
  test('Should be add error without field', () => {
    const notification = new Notification();
    notification.addError('error');
    expect(notification.hasErrors()).toBeTruthy();
    expect(notification.toJSON()).toEqual(['error']);
  });

  test('Should be add error with field', () => {
    const notification = new Notification();
    notification.addError('error', 'name');
    expect(notification.hasErrors()).toBeTruthy();
    expect(notification.toJSON()).toEqual([{ name: ['error'] }]);
  });

  test('Should be set error without field', () => {
    const notification = new Notification();
    notification.setError('error');
    expect(notification.hasErrors()).toBeTruthy();
    expect(notification.toJSON()).toEqual(['error']);
  });

  test('Should be add error with field', () => {
    const notification = new Notification();
    notification.setError('error', 'name');
    expect(notification.hasErrors()).toBeTruthy();
    expect(notification.toJSON()).toEqual([{ name: ['error'] }]);
  });

  test('Should be cpy errors', () => {
    const notification = new Notification();
    notification.addError('error', 'name');

    const notificationTwo = new Notification();
    notificationTwo.copyErrors(notification);
    expect(notificationTwo.hasErrors()).toBeTruthy();
    expect(notificationTwo.toJSON()).toEqual([{ name: ['error'] }]);
  });
});
