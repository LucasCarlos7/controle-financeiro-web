import { FormSection, TextRow, ToggleRow } from '../../../../shared/components/ui/FormRows';
import type { PickerOption } from '../../../../shared/components/ui/OptionPicker';
import { SelectRowField } from '../../../../shared/components/ui/SelectRowField';
import { useTransactionForm } from './useTransactionForm';

const PERIODICIDADES: PickerOption[] = [
  { value: 'Mensal', label: 'Mensal', description: 'Repete mensalmente', icon: 'repeat' },
  { value: 'Fixa', label: 'Intervalo personalizado', description: 'A cada N meses', icon: 'calendar' },
  { value: 'Parcelada', label: 'Parcelada', description: 'Divide em N parcelas, ex.: "Notebook (3/10)"', icon: 'card' },
];

/** "Repetir ou parcelar": periodicidade, intervalo e número de parcelas. */
export function RecurrenceSection() {
  const {
    control,
    register,
    watch,
    formState: { errors },
  } = useTransactionForm();
  const recorrente = watch('recorrente');

  return (
    <FormSection label="Repetição">
      <ToggleRow
        icon="repeat"
        label="Repetir ou parcelar"
        description="Os próximos lançamentos nascem pendentes."
        {...register('recorrente')}
      />

      {recorrente && (
        <>
          <SelectRowField
            control={control}
            name="tipoRecorrencia"
            icon="repeat"
            label="Periodicidade"
            pickerTitle="Como se repete?"
            options={PERIODICIDADES}
            required
            error={errors.tipoRecorrencia?.message}
          />
          <TextRow
            id="intervaloMeses"
            icon="calendar"
            label="A cada (meses)"
            type="number"
            inputMode="numeric"
            min={1}
            max={12}
            error={errors.intervaloMeses?.message}
            {...register('intervaloMeses')}
          />
          <TextRow
            id="totalParcelas"
            icon="text"
            label="Parcelas"
            type="number"
            inputMode="numeric"
            min={1}
            max={120}
            // Vazio: a API gera 100 lançamentos.
            placeholder="Opcional (padrão: 100)"
            error={errors.totalParcelas?.message}
            {...register('totalParcelas')}
          />
        </>
      )}
    </FormSection>
  );
}
