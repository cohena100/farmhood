"use client";

import { useRouter } from "@/navigation";
import { Button, Modal, Textarea } from "flowbite-react";
import { useTranslations } from "next-intl";
import { startTransition, useState } from "react";

export interface OrderFeedbackProps {
  params: { orderId: string };
}

export default function OrderFeedbackModal({
  params: { orderId },
}: OrderFeedbackProps) {
  const [openModal, setOpenModal] = useState(true);
  const router = useRouter();
  const t = useTranslations("home");

  return (
    <Modal show={openModal} onClose={() => setOpenModal(false)}>
      <Modal.Body>
        <form className="flex flex-col gap-4">
          <Textarea
            className="border-red-500 ring-red-500 focus:border-red-500 focus:ring-red-500 dark:border-red-500 dark:focus:border-red-500 dark:focus:ring-red-500"
            id="comment"
            maxLength={150}
            placeholder={t("Leave a comment...")}
            required
            rows={4}
          />
          <div className="flex gap-4">
            <Button
              gradientDuoTone="pinkToOrange"
              onClick={() =>
                startTransition(() => {
                  router.back();
                })
              }
            >
              {t("Send")}
            </Button>
            <Button
              gradientDuoTone="pinkToOrange"
              onClick={() =>
                startTransition(() => {
                  router.back();
                })
              }
            >
              {t("Cancel")}
            </Button>
          </div>
        </form>
      </Modal.Body>
    </Modal>
  );
}
