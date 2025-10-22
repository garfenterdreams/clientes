import { type WorkspaceEventBatch } from 'src/engine/workspace-event-emitter/types/workspace-event-batch.type';
import type { ObjectRecordEvent } from 'src/engine/core-modules/event-emitter/types/object-record-event.event';
import type { WebhookEntity } from 'src/engine/core-modules/webhook/webhook.entity';
import { transformEventBatchToWebhookEvents } from 'src/engine/core-modules/webhook/utils/transform-event-batch-to-webhook-events';
import { getMockObjectMetadataEntity } from 'src/utils/__test__/get-object-metadata-entity.mock';

const mockObjectMetadata = getMockObjectMetadataEntity({
  id: 'id',
  nameSingular: 'nameSingular',
  namePlural: 'namePlural',
  workspaceId: 'workspaceId',
});

describe('transformEventBatchToWebhookEvents', () => {
  it('should transform properly', () => {
    const workspaceEventBatch = {
      workspaceId: 'workspaceId',
      objectMetadata: mockObjectMetadata,
      name: 'objectNameSingular.created',
      events: [
        {
          recordId: 'recordId-1',
          properties: {
            after: {
              id: 'id-1',
              nameSingular: 'nameSingular-1',
            },
          },
        },
        {
          recordId: 'recordId-2',
          properties: {
            before: {
              id: 'id-2',
              nameSingular: 'nameSingular-2',
            },
          },
        },
        {
          recordId: 'recordId-3',
          properties: {
            after: {
              id: 'id-3',
              nameSingular: 'nameSingular-3',
              ***REMOVED***,
            },
            updatedFields: ['nameSingular'],
          },
        },
      ],
    } as WorkspaceEventBatch<ObjectRecordEvent>;

    const webhooks = [
      {
        id: 'webhook-id',
        targetUrl: 'targetUrl',
        secret: 'secret',
      },
      {
        id: 'webhook-id-2',
        targetUrl: 'targetUrl-2',
        ***REMOVED***,
      },
    ] as WebhookEntity[];

    const result = transformEventBatchToWebhookEvents({
      workspaceEventBatch,
      webhooks,
    });
    const expectedResultWithoutEventDate = [
      {
        targetUrl: 'targetUrl',
        eventName: 'objectNameSingular.created',
        objectMetadata: {
          id: mockObjectMetadata.id,
          nameSingular: mockObjectMetadata.nameSingular,
        },
        workspaceId: 'workspaceId',
        webhookId: 'webhook-id',
        record: {
          id: 'id-1',
          nameSingular: 'nameSingular-1',
        },
        secret: 'secret',
      },
      {
        targetUrl: 'targetUrl',
        eventName: 'objectNameSingular.created',
        objectMetadata: {
          id: mockObjectMetadata.id,
          nameSingular: mockObjectMetadata.nameSingular,
        },
        workspaceId: 'workspaceId',
        webhookId: 'webhook-id',
        record: {
          id: 'id-2',
          nameSingular: 'nameSingular-2',
        },
        secret: 'secret',
      },
      {
        targetUrl: 'targetUrl',
        eventName: 'objectNameSingular.created',
        objectMetadata: {
          id: mockObjectMetadata.id,
          nameSingular: mockObjectMetadata.nameSingular,
        },
        workspaceId: 'workspaceId',
        webhookId: 'webhook-id',
        record: {
          id: 'id-3',
          nameSingular: 'nameSingular-3',
          ***REMOVED***,
        },
        updatedFields: ['nameSingular'],
        secret: 'secret',
      },
      {
        targetUrl: 'targetUrl-2',
        eventName: 'objectNameSingular.created',
        objectMetadata: {
          id: mockObjectMetadata.id,
          nameSingular: mockObjectMetadata.nameSingular,
        },
        workspaceId: 'workspaceId',
        webhookId: 'webhook-id-2',
        record: {
          id: 'id-1',
          nameSingular: 'nameSingular-1',
        },
        ***REMOVED***,
      },
      {
        targetUrl: 'targetUrl-2',
        eventName: 'objectNameSingular.created',
        objectMetadata: {
          id: mockObjectMetadata.id,
          nameSingular: mockObjectMetadata.nameSingular,
        },
        workspaceId: 'workspaceId',
        webhookId: 'webhook-id-2',
        record: {
          id: 'id-2',
          nameSingular: 'nameSingular-2',
        },
        ***REMOVED***,
      },
      {
        targetUrl: 'targetUrl-2',
        eventName: 'objectNameSingular.created',
        objectMetadata: {
          id: mockObjectMetadata.id,
          nameSingular: mockObjectMetadata.nameSingular,
        },
        workspaceId: 'workspaceId',
        webhookId: 'webhook-id-2',
        record: {
          id: 'id-3',
          nameSingular: 'nameSingular-3',
          ***REMOVED***,
        },
        updatedFields: ['nameSingular'],
        ***REMOVED***,
      },
    ];

    const resultWithoutEventDate = result.map((event) => {
      const { eventDate: _, ...eventWithoutEventDate } = event;

      return eventWithoutEventDate;
    });

    expect(resultWithoutEventDate).toEqual(expectedResultWithoutEventDate);
  });

  it('should sanitize records properly', () => {
    const workspaceEventBatch = {
      workspaceId: 'workspaceId',
      objectMetadata: mockObjectMetadata,
      name: 'webhook.created',
      events: [
        {
          recordId: 'recordId-1',
          properties: {
            after: {
              id: 'id-1',
              targetUrl: 'targetUrl-1',
              ***REMOVED***,
            },
          },
        },
      ],
    } as WorkspaceEventBatch<ObjectRecordEvent>;

    const webhooks = [
      {
        id: 'webhook-id',
        targetUrl: 'targetUrl',
        secret: 'secret',
      },
    ] as WebhookEntity[];

    const result = transformEventBatchToWebhookEvents({
      workspaceEventBatch,
      webhooks,
    });

    const expectedResultWithoutEventDate = [
      {
        targetUrl: 'targetUrl',
        eventName: 'webhook.created',
        objectMetadata: {
          id: mockObjectMetadata.id,
          nameSingular: mockObjectMetadata.nameSingular,
        },
        workspaceId: 'workspaceId',
        webhookId: 'webhook-id',
        record: {
          id: 'id-1',
          targetUrl: 'targetUrl-1',
          // No secret
        },
        secret: 'secret',
      },
    ];

    const resultWithoutEventDate = result.map((event) => {
      const { eventDate: _, ...eventWithoutEventDate } = event;

      return eventWithoutEventDate;
    });

    expect(resultWithoutEventDate).toEqual(expectedResultWithoutEventDate);
  });
});
