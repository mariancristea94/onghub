import { IInputConfig } from '../../interfaces/InputConfig.interface';

export const OrganizationGeneralConfig: Record<string, IInputConfig> = {
  name: {
    key: 'name',
    rules: {
      required: {
        value: true,
        message: 'Organization Name is required.',
      },
      maxLength: {
        value: 100,
        message: 'Organization Name has a maximum length of 100 characters.',
      },
    },
    config: {
      type: 'text',
      label: 'Denumirea organizatiei*',
      helperText: 'Denumirea oficiala, conform cu Registrul ONG',
      placeholder: '',
    },
  },
  email: {
    key: 'email',
    rules: {
      required: {
        value: true,
        message: 'Organization Name is required.',
      },
      maxLength: {
        value: 100,
        message: 'Organization Name has a maximum length of 100 characters.',
      },
    },
    config: {
      type: 'text',
      label: 'Denumirea organizatiei*',
      helperText: 'Denumirea oficiala, conform cu Registrul ONG',
      placeholder: '',
    },
  },
  phone: {
    key: 'phone',
    rules: {
      required: {
        value: true,
        message: 'Organization Name is required.',
      },
      maxLength: {
        value: 100,
        message: 'Organization Name has a maximum length of 100 characters.',
      },
    },
    config: {
      type: 'text',
      label: 'Denumirea organizatiei*',
      helperText: 'Denumirea oficiala, conform cu Registrul ONG',
      placeholder: '',
    },
  },
  contact_name: {
    key: 'contact_name',
    rules: {
      required: {
        value: true,
        message: 'Organization Name is required.',
      },
      maxLength: {
        value: 100,
        message: 'Organization Name has a maximum length of 100 characters.',
      },
    },
    config: {
      type: 'text',
      label: 'Denumirea organizatiei*',
      helperText: 'Denumirea oficiala, conform cu Registrul ONG',
      placeholder: '',
    },
  },
};
