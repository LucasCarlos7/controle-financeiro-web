import { Checkbox } from '../../../../shared/components/ui/Checkbox';
import { Input } from '../../../../shared/components/ui/Input';
import { Select } from '../../../../shared/components/ui/Select';
import { useTransactionForm } from './useTransactionForm';

/** "Repetir ou parcelar": periodicidade, intervalo e fim (data ou número de parcelas). */
export function RecurrenceFields() {
  const {
    register,
    watch,
    formState: { errors },
  } = useTransactionForm();
  const recorrente = watch('recorrente');
  const tipoRecorrencia = watch('tipoRecorrencia');

  return (
    <div className="rounded-card border border-border bg-surface-sunken px-4 py-1">
      <Checkbox
        label="Repetir ou parcelar"
        description="Gera os próximos lançamentos como pendentes."
        {...register('recorrente')}
      />

      {recorrente && (
        <div className="space-y-4 pb-4 pt-2">
          <Select
            id="tipoRecorrencia"
            label="Periodicidade"
            error={errors.tipoRecorrencia?.message}
            {...register('tipoRecorrencia')}
          >
            <option value="Mensal">Mensal</option>
            <option value="Fixa">Intervalo personalizado</option>
            <option value="Parcelada">Parcelada</option>
          </Select>

          <div className="grid grid-cols-2 gap-4">
            <Input
              id="intervaloMeses"
              type="number"
              inputMode="numeric"
              min={1}
              max={12}
              label="A cada (meses)"
              error={errors.intervaloMeses?.message}
              {...register('intervaloMeses')}
            />

            {tipoRecorrencia === 'Parcelada' ? (
              <Input
                id="totalParcelas"
                type="number"
                inputMode="numeric"
                min={1}
                max={120}
                label="Total de parcelas"
                error={errors.totalParcelas?.message}
                {...register('totalParcelas')}
              />
            ) : (
              <Input
                id="dataFim"
                type="date"
                label="Repetir até"
                hint="Opcional; sem data, até 24 lançamentos."
                error={errors.dataFim?.message}
                {...register('dataFim')}
              />
            )}
          </div>
        </div>
      )}
    </div>
  );
}
