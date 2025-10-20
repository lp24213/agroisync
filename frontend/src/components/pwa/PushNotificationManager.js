import React, { useState, useEffect, useCallback } from 'react';
import { useTranslation } from 'react-i18next';
import { motion, AnimatePresence } from 'framer-motion';
import { Bell, BellOff, Settings, X } from 'lucide-react';
import { useAnalytics } from '../../hooks/useAnalytics';
import { getApiUrl } from '../../utils/apiHelper';

const PushNotificationManager = () => {
  const { t } = useTranslation();
  const analytics = useAnalytics();
  const [isSupported, setIsSupported] = useState(false);
  const [permission, setPermission] = useState('default');
  const [isSubscribed, setIsSubscribed] = useState(false);
  const [subscription, setSubscription] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const [error, setError] = useState('');

  // Verificar permissão atual
  const checkPermission = useCallback(() => {
    if ('Notification' in window) {
      setPermission(Notification.permission);
    }
  }, []);

  // Verificar se já está inscrito
  const checkSubscription = useCallback(async () => {
    try {
      const registration = await navigator.serviceWorker.ready;
      const sub = await registration.pushManager.getSubscription();
      setIsSubscribed(!!sub);
      setSubscription(sub);
    } catch (error) {
      console.error('Error checking subscription:', error);
    }
  }, []);

  // Verificar suporte a notificações push
  useEffect(() => {
    if ('serviceWorker' in navigator && 'PushManager' in window) {
      setIsSupported(true);
      checkPermission();
      checkSubscription();
    }
  }, [checkPermission, checkSubscription]);

  // Inscrever-se para notificações push
  const subscribeToPush = useCallback(async () => {
    try {
      const registration = await navigator.serviceWorker.ready;

      // Configurações do VAPID
      const vapidPublicKey = process.env.REACT_APP_VAPID_PUBLIC_KEY;
      if (!vapidPublicKey) {
        throw new Error('VAPID public key não configurada');
      }

      const subscription = await registration.pushManager.subscribe({
        userVisibleOnly: true,
        applicationServerKey: urlBase64ToUint8Array(vapidPublicKey)
      });

      // Enviar subscription para o servidor
      const response = await fetch(getApiUrl('notifications/subscribe'), {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${localStorage.getItem('accessToken')}`
        },
        body: JSON.stringify({
          subscription: subscription,
          userId: localStorage.getItem('userId')
        })
      });

      if (response.ok) {
        setSubscription(subscription);
        setIsSubscribed(true);
        analytics.trackEvent('notification_subscribed');
      } else {
        throw new Error('Erro ao registrar subscription');
      }
    } catch (error) {
      console.error('Error subscribing to push:', error);
      setError(error.message);
      analytics.trackError('notification_subscription_error', error.message);
    }
  }, [analytics]);

  // Solicitar permissão para notificações
  const requestPermission = useCallback(async () => {
    setIsLoading(true);
    setError('');

    try {
      if (!('Notification' in window)) {
        throw new Error('Este navegador não suporta notificações');
      }

      const permission = await Notification.requestPermission();
      setPermission(permission);

      if (permission === 'granted') {
        analytics.trackEvent('notification_permission_granted');
        await subscribeToPush();
      } else if (permission === 'denied') {
        analytics.trackEvent('notification_permission_denied');
        setError(t('notifications.permissionDenied', 'Permissão negada para notificações'));
      }
    } catch (error) {
      console.error('Error requesting permission:', error);
      setError(error.message);
      analytics.trackError('notification_permission_error', error.message);
    } finally {
      setIsLoading(false);
    }
  }, [analytics, t, subscribeToPush]);

  // Cancelar inscrição
  const unsubscribeFromPush = useCallback(async () => {
    setIsLoading(true);
    setError('');

    try {
      if (subscription) {
        await subscription.unsubscribe();

        // Notificar servidor sobre cancelamento
        await fetch(getApiUrl('notifications/unsubscribe'), {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${localStorage.getItem('accessToken')}`
          },
          body: JSON.stringify({
            endpoint: subscription.endpoint
          })
        });

        setIsSubscribed(false);
        setSubscription(null);
        analytics.trackEvent('notification_unsubscribed');
      }
    } catch (error) {
      console.error('Error unsubscribing from push:', error);
      setError(error.message);
      analytics.trackError('notification_unsubscription_error', error.message);
    } finally {
      setIsLoading(false);
    }
  }, [subscription, analytics]);

  // Testar notificação
  const testNotification = useCallback(() => {
    if (permission === 'granted') {
      new Notification(t('notifications.testTitle', 'Teste AGROISYNC'), {
        body: t('notifications.testBody', 'Esta é uma notificação de teste do AGROISYNC'),
        icon: '/icons/icon-192x192.png',
        badge: '/icons/badge-72x72.png',
        tag: 'test-notification',
        requireInteraction: false
      });

      analytics.trackEvent('notification_test_sent');
    }
  }, [permission, t, analytics]);

  // Converter chave VAPID
  const urlBase64ToUint8Array = base64String => {
    const padding = '='.repeat((4 - (base64String.length % 4)) % 4);
    const base64 = (base64String + padding).replace(/-/g, '+').replace(/_/g, '/');

    const rawData = window.atob(base64);
    const outputArray = new Uint8Array(rawData.length);

    for (let i = 0; i < rawData.length; ++i) {
      outputArray[i] = rawData.charCodeAt(i);
    }
    return outputArray;
  };

  if (!isSupported) {
    return (
      <div className='rounded-lg border border-yellow-200 bg-yellow-50 p-4'>
        <div className='flex items-center'>
          <BellOff className='mr-2 h-5 w-5 text-yellow-600' />
          <span className='text-sm text-yellow-800'>
            {t('notifications.notSupported', 'Notificações push não são suportadas neste navegador')}
          </span>
        </div>
      </div>
    );
  }

  return (
    <div className='rounded-lg border border-gray-200 bg-white p-6 dark:border-gray-700 dark:bg-gray-800'>
      <div className='mb-4 flex items-center justify-between'>
        <div className='flex items-center'>
          <Bell className='mr-3 h-6 w-6 text-blue-600' />
          <div>
            <h3 className='text-lg font-semibold text-gray-900 dark:text-white'>
              {t('notifications.title', 'Notificações Push')}
            </h3>
            <p className='text-sm text-gray-600 dark:text-gray-400'>
              {t('notifications.description', 'Receba notificações sobre pedidos, fretes e atualizações')}
            </p>
          </div>
        </div>
        <button
          onClick={() => setShowSettings(!showSettings)}
          className='p-2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300'
        >
          <Settings className='h-5 w-5' />
        </button>
      </div>

      <AnimatePresence>
        {error && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className='mb-4 rounded-lg border border-red-200 bg-red-50 p-3'
          >
            <div className='flex items-center justify-between'>
              <span className='text-sm text-red-800'>{error}</span>
              <button onClick={() => setError('')} className='text-red-600 hover:text-red-800'>
                <X className='h-4 w-4' />
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <div className='space-y-4'>
        {/* Status da permissão */}
        <div className='flex items-center justify-between'>
          <span className='text-sm text-gray-600 dark:text-gray-400'>
            {t('notifications.permission', 'Permissão')}:
          </span>
          <span
            className={`text-sm font-medium ${
              permission === 'granted' ? 'text-green-600' : permission === 'denied' ? 'text-red-600' : 'text-yellow-600'
            }`}
          >
            {permission === 'granted'
              ? t('notifications.granted', 'Concedida')
              : permission === 'denied'
                ? t('notifications.denied', 'Negada')
                : t('notifications.default', 'Não solicitada')}
          </span>
        </div>

        {/* Status da inscrição */}
        <div className='flex items-center justify-between'>
          <span className='text-sm text-gray-600 dark:text-gray-400'>
            {t('notifications.subscription', 'Inscrição')}:
          </span>
          <span className={`text-sm font-medium ${isSubscribed ? 'text-green-600' : 'text-gray-600'}`}>
            {isSubscribed ? t('notifications.active', 'Ativa') : t('notifications.inactive', 'Inativa')}
          </span>
        </div>

        {/* Botões de ação */}
        <div className='flex space-x-3'>
          {permission !== 'granted' ? (
            <button
              onClick={requestPermission}
              disabled={isLoading}
              className='flex flex-1 items-center justify-center rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-blue-700 disabled:bg-blue-400'
            >
              {isLoading ? (
                <div className='mr-2 h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent' />
              ) : (
                <Bell className='mr-2 h-4 w-4' />
              )}
              {t('notifications.enable', 'Ativar Notificações')}
            </button>
          ) : isSubscribed ? (
            <>
              <button
                onClick={unsubscribeFromPush}
                disabled={isLoading}
                className='flex flex-1 items-center justify-center rounded-lg bg-red-600 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-red-700 disabled:bg-red-400'
              >
                {isLoading ? (
                  <div className='mr-2 h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent' />
                ) : (
                  <BellOff className='mr-2 h-4 w-4' />
                )}
                {t('notifications.disable', 'Desativar')}
              </button>
              <button
                onClick={testNotification}
                className='rounded-lg border border-gray-300 px-4 py-2 text-sm font-medium text-gray-700 transition-colors hover:bg-gray-50 dark:border-gray-600 dark:text-gray-300 dark:hover:bg-gray-700'
              >
                {t('notifications.test', 'Testar')}
              </button>
            </>
          ) : (
            <button
              onClick={subscribeToPush}
              disabled={isLoading}
              className='flex flex-1 items-center justify-center rounded-lg bg-green-600 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-green-700 disabled:bg-green-400'
            >
              {isLoading ? (
                <div className='mr-2 h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent' />
              ) : (
                <Bell className='mr-2 h-4 w-4' />
              )}
              {t('notifications.subscribe', 'Inscrever-se')}
            </button>
          )}
        </div>

        {/* Configurações avançadas */}
        <AnimatePresence>
          {showSettings && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className='border-t border-gray-200 pt-4 dark:border-gray-700'
            >
              <h4 className='mb-3 text-sm font-medium text-gray-900 dark:text-white'>
                {t('notifications.settings', 'Configurações')}
              </h4>
              <div className='space-y-2 text-sm text-gray-600 dark:text-gray-400'>
                <p>• {t('notifications.setting1', 'Receba notificações sobre novos pedidos')}</p>
                <p>• {t('notifications.setting2', 'Atualizações de status de fretes')}</p>
                <p>• {t('notifications.setting3', 'Mensagens importantes do sistema')}</p>
                <p>• {t('notifications.setting4', 'Ofertas e promoções especiais')}</p>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};

export default PushNotificationManager;
