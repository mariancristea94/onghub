import React, { useEffect, useState } from 'react';
import { Controller, useForm } from 'react-hook-form';
import { classNames } from '../../common/helpers/tailwind.helper';
import InputField from '../../components/InputField/InputField';
import { AccountConfig } from './AccountConfig';
import { Auth } from 'aws-amplify';
import { useErrorToast, useSuccessToast } from '../../common/hooks/useToast';
import { useUserMutation } from '../../services/user/User.queries';
import { useAuthContext } from '../../contexts/AuthContext';
import { useUser } from '../../store/user/User.selectors';
import ConfirmationModal from '../../components/confim-removal-modal/ConfirmationModal';
import { useTranslation } from 'react-i18next';

const Account = () => {
  const [readonly, setReadonly] = useState(true);
  const { logout } = useAuthContext();
  const {
    handleSubmit,
    control,
    formState: { errors },
    reset,
    watch,
  } = useForm({
    mode: 'onSubmit',
    reValidateMode: 'onChange',
  });
  const [isAccountDeleteModalOpen, setAccountDeleteModal] = useState(false);
  const { mutateAsync: deleteUser, error: deleteUserError } = useUserMutation();
  const { profile } = useUser();
  const { t } = useTranslation(['account', 'common']);

  useEffect(() => {
    useErrorToast((deleteUserError as any)?.response?.data?.message);
  }, [deleteUserError]);

  const newPassword = watch('newPassword');

  const startChangePassword = () => {
    setReadonly(false);
  };

  const onChangePassword = async (data: any) => {
    Auth.currentAuthenticatedUser()
      .then((user) => {
        return Auth.changePassword(user, data.oldPassword, data.newPassword);
      })
      .then(() => {
        setReadonly(true);
        useSuccessToast(t('password'));
      })
      .catch((err) => {
        // TODO: Better error handling
        useErrorToast(err.message);
      });
  };

  const handleUserDelete = async () => {
    setAccountDeleteModal(false);
    await deleteUser();
    logout();
  };

  return (
    <div>
      <div className="flex items-start justify-between pt-1 pr-1 pb-6">
        <div className="flex flex-col">
          <p className="text-gray-800 font-titilliumBold text-3xl">{t('my_acc')}</p>
          <p className="text-gray-400 pt-6">{t('acc_descr')}</p>
        </div>
        <button
          type="button"
          className="red-button"
          onClick={() => {
            setAccountDeleteModal(true);
          }}
        >
          {t('close.acc')}
        </button>
      </div>
      <div className="w-full bg-white shadow rounded-lg ">
        <div className="py-5 px-10 flex justify-between align-center">
          <span className="font-titilliumBold text-xl text-gray-800 flex items-center">
            {t('settings')}
          </span>
          <div className="flex gap-4">
            {!readonly && (
              <button
                type="button"
                className={'edit-button'}
                onClick={() => {
                  reset();
                  setReadonly(true);
                }}
              >
                {'Inapoi'}
              </button>
            )}

            <button
              type="button"
              className={classNames(readonly ? 'edit-button' : 'save-button')}
              onClick={readonly ? startChangePassword : handleSubmit(onChangePassword)}
            >
              {readonly ? t('change_pass') : t('save', { ns: 'common' })}
            </button>
          </div>
        </div>

        <div className="w-full border-t border-gray-300" />
        {readonly && (
          <div className="p-5 sm:p-10 flex flex-col">
            <span>{t('settings_descr')}</span>
            <div className="flex flex-col gap-4 pt-4">
              <div className="flex flex-col gap-2">
                <span className="text-gray-700">{t('name')}</span>
                <span className="text-gray-800 font-titilliumBold">{profile?.name}</span>
              </div>
              <div className="flex flex-col gap-2">
                <span className="text-gray-700">{t('email')}</span>
                <span className="text-gray-800 font-titilliumBold">{profile?.email} </span>
              </div>
            </div>
          </div>
        )}
        {!readonly && (
          <div className="p-5 sm:p-10 flex flex-col gap-4 xl:w-1/2 w-full">
            <div className="flex gap-4 w-full">
              <Controller
                key={AccountConfig.oldPassword.key}
                name={AccountConfig.oldPassword.key}
                rules={AccountConfig.oldPassword.rules}
                control={control}
                render={({ field: { onChange, value } }) => {
                  return (
                    <InputField
                      config={{
                        ...AccountConfig.oldPassword.config,

                        name: AccountConfig.oldPassword.key,
                        error: errors[AccountConfig.oldPassword.key]?.message,
                        defaultValue: value,
                        onChange: onChange,
                      }}
                      readonly={readonly}
                    />
                  );
                }}
              />
              <div className="flex w-full"></div>
            </div>
            <div className="flex gap-4">
              <Controller
                key={AccountConfig.newPassword.key}
                name={AccountConfig.newPassword.key}
                rules={AccountConfig.newPassword.rules}
                control={control}
                render={({ field: { onChange, value } }) => {
                  return (
                    <InputField
                      config={{
                        ...AccountConfig.newPassword.config,
                        name: AccountConfig.newPassword.key,
                        error: errors[AccountConfig.newPassword.key]?.message,
                        defaultValue: value,
                        onChange: onChange,
                      }}
                      readonly={readonly}
                    />
                  );
                }}
              />
              <Controller
                key={AccountConfig.matchPassword.key}
                name={AccountConfig.matchPassword.key}
                rules={{
                  ...AccountConfig.matchPassword.rules,
                  validate: (value) => value === newPassword || t('wrong_pass'),
                }}
                control={control}
                render={({ field: { onChange, value } }) => {
                  return (
                    <InputField
                      config={{
                        ...AccountConfig.matchPassword.config,
                        name: AccountConfig.matchPassword.key,
                        error: errors[AccountConfig.matchPassword.key]?.message,
                        defaultValue: value,
                        onChange: onChange,
                      }}
                      readonly={readonly}
                    />
                  );
                }}
              />
            </div>
          </div>
        )}
      </div>
      {isAccountDeleteModalOpen && (
        <ConfirmationModal
          title={t('close.title')}
          description={t('close.descr')}
          closeBtnLabel={t('back', { ns: 'common' })}
          confirmBtnLabel={t('close.acc')}
          onClose={() => {
            setAccountDeleteModal(false);
          }}
          onConfirm={handleUserDelete}
        />
      )}
    </div>
  );
};

export default Account;
