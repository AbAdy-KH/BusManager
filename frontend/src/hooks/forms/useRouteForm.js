import { useState, useEffect } from 'react';
import { useLanguage } from '../../context/useLanguage';
import { createRoute, updateRoute, fetchRouteById } from '../../services/routeService';

export function useRouteForm({ isOpen, route, onSuccess, onClose }) {
  const { t } = useLanguage();
  const isEdit = !!route;

  const [name, setName] = useState('');
  const [code, setCode] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!isOpen) return;
    setError(null);

    if (isEdit) {
      if (route.name !== undefined && route.code !== undefined) {
        setName(route.name || '');
        setCode(route.code || '');
      } else if (route.id) {
        fetchRouteById(route.id)
          .then((full) => {
            if (full) {
              setName(full.name || '');
              setCode(full.code || '');
            }
          })
          .catch(() => {
            setError(t.routeLoadError);
          });
      }
    } else {
      setName('');
      setCode('');
    }
  }, [isOpen, route, isEdit, t]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!name.trim()) {
      setError(t.routeNameRequired || 'Route name is required.');
      return;
    }

    if (!code.trim()) {
      setError(t.routeCodeRequired || 'Route code is required.');
      return;
    }

    setSubmitting(true);
    setError(null);

    const payload = {
      name: name.trim(),
      code: code.trim(),
    };

    try {
      if (isEdit) {
        await updateRoute(route.id, payload);
      } else {
        await createRoute(payload);
      }
      onSuccess?.();
      onClose?.();
    } catch (err) {
      setError(err.message || 'Failed to save route.');
    } finally {
      setSubmitting(false);
    }
  };

  return {
    t,
    isEdit,
    name,
    setName,
    code,
    setCode,
    submitting,
    error,
    handleSubmit,
  };
}
