import { Notify } from 'notiflix/build/notiflix-notify-aio';

function showMessageSuccess(message) {
  Notify.success(message);
}

function showMessageFailure(message) {
  Notify.failure(message);
}

function showMessageWarning(message) {
  Notify.warning(message);
}

function showMessageInfo(message) {
  Notify.info(message);
}

export {
  showMessageSuccess,
  showMessageFailure,
  showMessageWarning,
  showMessageInfo,
};
