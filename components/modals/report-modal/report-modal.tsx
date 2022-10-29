import {
  faExclamationCircle,
  faExclamationTriangle,
  faTimes,
} from '@fortawesome/free-solid-svg-icons';
import React, { FC, FormEvent, useCallback, useState } from 'react';
import Modal, { ModalBody, ModalFooter } from '@/components/modals/modal';
import Wallpaper, { getThumbnailUrl } from '@/entities/wallpaper';
import Thumbnail from '@/components/thumbnail';
import Button from '@/components/buttons/button';
import Alert from '@/components/alert';
import { FormGroup, Label, TextField } from '@/components/form';
import ReportTypeSelectbox from '@/components/selectboxes/report-type-selectbox';
import styles from './report-modal.module.scss';
import { ReportType } from '@/entities/report';
import Link from 'next/link';

interface ReportModalProps {
  shown: boolean;
  wallpaper?: Wallpaper;
  busy?: boolean;
  error?: string,
  onClose: () => void;
  onSubmit: (event: FormEvent<HTMLFormElement>) => void;
  onInputChange: () => void;
}

const ReportModal: FC<ReportModalProps> = ({
  busy, shown, onClose, wallpaper, onSubmit, error, onInputChange,
}) => {
  const [type, setType] = useState<ReportType | ''>('');

  const handleReportTypeChange = useCallback((type: ReportType | '') => {
    setType(type);
    onInputChange();
  }, []);

  return (
    <Modal
      title="Report wallpaper"
      shown={shown}
      nonClosable={busy}
      onClose={onClose}
      large
    >
      <form onSubmit={onSubmit}>
        <input type="hidden" name="wallpaperId" value={wallpaper?.id} />
        <ModalBody className={styles.body}>
          {!!error && <Alert icon={faExclamationCircle}>{error}</Alert>}
          {!error && (
            <Alert>
              Please tell us what is wrong with this wallpaper.
              Be as detailed as you can!
            </Alert>
          )}
          <div className={styles.sheets}>
            <div className={styles.wallpaperSheet}>
              {!!wallpaper && (
                <Thumbnail
                  id={wallpaper.id}
                  width={wallpaper.width}
                  height={wallpaper.height}
                  url={getThumbnailUrl(wallpaper.id, wallpaper.mimetype)}
                  purity={wallpaper.purity}
                />
              )}
            </div>
            <div className={styles.reportSheet}>
              <FormGroup>
                <Label>Reason:</Label>
                <ReportTypeSelectbox
                  onChange={handleReportTypeChange}
                  value={type}
                />
              </FormGroup>
              {type === 'low_quality' && (
                <Alert icon={faExclamationCircle} info>
                  Low-quality edits (rotated, mirrored images, collages, etc),
                  screenshots. For more information read the
                  {' '}
                  <Link href="/help/faq#upload" target="_blank">FAQ</Link>
                </Alert>
              )}
              {type === 'rule' && (
                <Alert icon={faExclamationCircle} info>
                  Please indicate which rule is violated.
                  For more information about the rules read the
                  {' '}
                  <Link href="/help/faq#upload" target="_blank">FAQ</Link>
                </Alert>
              )}
              {type === 'copyright' && (
                <Alert icon={faExclamationCircle} info>
                  If you are the content owner it&apos;s also possible to add
                  your works to banned resources on this website to prevent
                  further uploading any of your works.
                  Alternatively, we can also move the images to your account
                  on this website.
                  Read more about all options in
                  {' '}
                  <Link href="/help/faq#copyright" target="_blank">FAQ</Link>
                  .
                </Alert>
              )}
              {type === 'illegal' && (
                <Alert icon={faExclamationCircle} info>
                  For more information read the
                  {' '}
                  <Link href="/help/faq#upload" target="_blank">FAQ</Link>
                  .
                </Alert>
              )}
              {type === 'duplicate' && (
                <>
                  <Alert icon={faExclamationCircle} info>
                    The wallpaper ID can be taken from the preview page.
                  </Alert>
                  <FormGroup>
                    <Label htmlFor="report-duplicate-id">Duplicate wallpaper ID:</Label>
                    <TextField
                      name="duplicateId"
                      placeholder="E.g. 1df74e6d-d829-47ac-b74c-54b3085e9d80"
                      id="report-duplicate-id"
                      onChange={onInputChange}
                    />
                  </FormGroup>
                </>
              )}
              <FormGroup>
                <Label htmlFor="report-message">Message:</Label>
                <TextField
                  name="message"
                  placeholder="Additional info"
                  id="report-message"
                  onChange={onInputChange}
                />
              </FormGroup>
            </div>
          </div>
        </ModalBody>
        <ModalFooter spaceAround>
          <Button
            iconPrepend={faExclamationTriangle}
            loading={busy}
            disabled={busy}
            submit
          >
            Report!
          </Button>
          <Button
            iconPrepend={faTimes}
            dark onClick={onClose}
            disabled={busy}
          >
            Cancel
          </Button>
        </ModalFooter>
      </form>
    </Modal>
  );
};

ReportModal.displayName = 'ReportModal';

export default React.memo(ReportModal);
