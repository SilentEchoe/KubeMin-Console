import React, { useState } from 'react';
import Modal from '../../../components/base/Modal';
import Input from '../../../components/base/Input';
import Switch from '../../../components/base/switch';
import { Loader2 } from 'lucide-react';

export interface CreateBlankAppData {
    id: string;
    name: string;
    namespace: string;
    image: string;
    alias: string;
    version: string;
    project: string;
    description: string;
    icon: string;
    tmp_enable?: boolean;
}

interface CreateBlankAppModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSubmit: (data: CreateBlankAppData) => Promise<void>;
}

const FormField: React.FC<{
    label: string;
    required?: boolean;
    children: React.ReactNode;
    error?: string;
}> = ({ label, required, children, error }) => (
    <div className="space-y-1.5">
        <label className="block text-sm font-medium text-gray-700">
            {label}
            {required && <span className="text-red-500 ml-0.5">*</span>}
        </label>
        {children}
        {error && <p className="text-xs text-red-500">{error}</p>}
    </div>
);

export const CreateBlankAppModal: React.FC<CreateBlankAppModalProps> = ({
    isOpen,
    onClose,
    onSubmit,
}) => {
    const [formData, setFormData] = useState<CreateBlankAppData>({
        id: '',
        name: '',
        namespace: 'default',
        image: 'nginx:latest',
        alias: '',
        version: '1.0.0',
        project: '',
        description: '',
        icon: '',
        tmp_enable: false,
    });

    const [errors, setErrors] = useState<Partial<Record<keyof CreateBlankAppData, string>>>({});
    const [isSubmitting, setIsSubmitting] = useState(false);

    const validateName = (name: string): boolean => {
        // checkname validation: lowercase alphanumeric, may contain hyphens, must start/end with alphanumeric
        const nameRegex = /^[a-z0-9]([a-z0-9-]*[a-z0-9])?$/;
        return nameRegex.test(name) && name.length >= 2 && name.length <= 63;
    };

    const validate = (): boolean => {
        const newErrors: Partial<Record<keyof CreateBlankAppData, string>> = {};

        // ID is optional

        if (!formData.name.trim()) {
            newErrors.name = 'Name is required';
        } else if (!validateName(formData.name)) {
            newErrors.name = 'Name must be lowercase alphanumeric, may contain hyphens, 2-63 chars';
        }

        if (!formData.namespace.trim()) {
            newErrors.namespace = 'Namespace is required';
        }

        if (!formData.project.trim()) {
            newErrors.project = 'Project is required';
        }

        // Image is optional

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleChange = (field: keyof CreateBlankAppData) => (
        e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
    ) => {
        setFormData(prev => ({
            ...prev,
            [field]: e.target.value,
        }));
        // Clear error when user starts typing
        if (errors[field]) {
            setErrors(prev => ({ ...prev, [field]: undefined }));
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!validate()) return;

        setIsSubmitting(true);
        try {
            await onSubmit(formData);
            handleClose();
        } catch (error) {
            console.error('Failed to create app:', error);
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleClose = () => {
        setFormData({
            id: '',
            name: '',
            namespace: 'default',
            image: 'nginx:latest',
            alias: '',
            version: '1.0.0',
            project: '',
            description: '',
            icon: '',
            tmp_enable: false,
        });
        setErrors({});
        onClose();
    };

    return (
        <Modal
            isShow={isOpen}
            onClose={handleClose}
            title="Create Blank App"
            className="max-w-[520px]"
        >
            <form onSubmit={handleSubmit} className="space-y-4">
                {/* Two column grid for compact fields */}
                <div className="grid grid-cols-2 gap-4">
                    <FormField label="ID" error={errors.id}>
                        <Input
                            value={formData.id}
                            onChange={handleChange('id')}
                            placeholder="auto-generated"
                            className="w-full"
                        />
                    </FormField>

                    <FormField label="Name" required error={errors.name}>
                        <Input
                            value={formData.name}
                            onChange={handleChange('name')}
                            placeholder="my-app"
                            className="w-full"
                        />
                    </FormField>
                </div>

                <div className="grid grid-cols-2 gap-4">
                    <FormField label="Alias" error={errors.alias}>
                        <Input
                            value={formData.alias}
                            onChange={handleChange('alias')}
                            placeholder="My Application"
                            className="w-full"
                        />
                    </FormField>

                    <FormField label="Namespace" required error={errors.namespace}>
                        <Input
                            value={formData.namespace}
                            onChange={handleChange('namespace')}
                            placeholder="default"
                            className="w-full"
                        />
                    </FormField>
                </div>

                <div className="grid grid-cols-2 gap-4">
                    <FormField label="Project" required error={errors.project}>
                        <Input
                            value={formData.project}
                            onChange={handleChange('project')}
                            placeholder="my-project"
                            className="w-full"
                        />
                    </FormField>

                    <FormField label="Version" error={errors.version}>
                        <Input
                            value={formData.version}
                            onChange={handleChange('version')}
                            placeholder="1.0.0"
                            className="w-full"
                        />
                    </FormField>
                </div>

                <FormField label="Image" error={errors.image}>
                    <Input
                        value={formData.image}
                        onChange={handleChange('image')}
                        placeholder="nginx:latest"
                        className="w-full"
                    />
                </FormField>

                <FormField label="Icon URL" error={errors.icon}>
                    <Input
                        value={formData.icon}
                        onChange={handleChange('icon')}
                        placeholder="https://example.com/icon.png"
                        className="w-full"
                    />
                </FormField>

                <FormField label="Description">
                    <textarea
                        value={formData.description}
                        onChange={handleChange('description')}
                        placeholder="Describe your application..."
                        rows={3}
                        className="flex w-full rounded-md border border-components-panel-border bg-components-input-bg-normal px-3 py-2 text-sm shadow-sm transition-colors placeholder:text-text-tertiary focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-state-accent-solid disabled:cursor-not-allowed disabled:opacity-50 resize-none"
                    />
                </FormField>

                {/* Temp Enable Toggle */}
                <div className="flex items-center justify-between py-2 px-3 bg-gray-50 rounded-lg">
                    <div>
                        <p className="text-sm font-medium text-gray-700">Temporary Enable</p>
                        <p className="text-xs text-gray-500">Enable temporary mode for this app</p>
                    </div>
                    <Switch
                        checked={formData.tmp_enable || false}
                        onChange={(checked) => setFormData(prev => ({ ...prev, tmp_enable: checked }))}
                        size="md"
                    />
                </div>

                {/* Action Buttons */}
                <div className="flex justify-end gap-3 pt-4 border-t border-gray-100">
                    <button
                        type="button"
                        onClick={handleClose}
                        disabled={isSubmitting}
                        className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors disabled:opacity-50"
                    >
                        Cancel
                    </button>
                    <button
                        type="submit"
                        disabled={isSubmitting}
                        className="px-4 py-2 text-sm font-medium text-white bg-primary-600 rounded-lg hover:bg-primary-700 transition-colors disabled:opacity-50 flex items-center gap-2"
                    >
                        {isSubmitting && <Loader2 className="w-4 h-4 animate-spin" />}
                        {isSubmitting ? 'Creating...' : 'Create App'}
                    </button>
                </div>
            </form>
        </Modal>
    );
};

