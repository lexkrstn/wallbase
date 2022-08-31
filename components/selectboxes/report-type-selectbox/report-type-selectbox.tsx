import { REPORT_TYPES, ReportType } from '@/entities/report';
import React, { FC, useCallback } from 'react';
import Selectbox, { SelectboxItemDto } from '../selectbox';

const LABEL_MAP: Record<ReportType, string> = {
  'rule': 'Rule broken',
  'copyright': 'Copyright violation',
  'duplicate': 'Duplicate',
  'illegal': 'Illegal content',
  'low_quality': 'Low quality',
  'other': 'Other (please specify)',
};

const ITEMS: SelectboxItemDto<string>[] = REPORT_TYPES.map(type => ({
  value: type,
  label: LABEL_MAP[type],
}));

interface ReportTypeSelectboxProps {
  className?: string;
  onChange: (value: ReportType | '') => void;
  value: ReportType | '';
}

const ReportTypeSelectbox: FC<ReportTypeSelectboxProps> = ({
  className, onChange, value,
}) => {
  const handleChange = useCallback((value: string) => {
    onChange(value as ReportType | '');
  }, [onChange]);

  return (
    <Selectbox
      className={className}
      name="type"
      items={ITEMS}
      onChange={handleChange}
      value={value}
      defaultLabel="Select a reason..."
    />
  );
};

ReportTypeSelectbox.displayName = 'ReportTypeSelectbox';

export default React.memo(ReportTypeSelectbox);
