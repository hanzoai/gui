import {
  Models,
  type ZenModelEntry,
  zenCatalog,
} from '@hanzo_network/hanzo-node-state/lib/utils/models';
import { useAddLLMProvider } from '@hanzo_network/hanzo-node-state/v2/mutations/addLLMProvider/useAddLLMProvider';
import {
  Badge,
  Button,
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@hanzo_network/hanzo-ui';
import { cn } from '@hanzo_network/hanzo-ui/utils';
import { useQuery } from '@tanstack/react-query';
import { Check, Cpu, Download, Loader2 } from 'lucide-react';
import { useMemo } from 'react';
import { toast } from 'sonner';

import { getEmbeddingEngineUrl, getEngineUrl } from '../../lib/hanzo-engine';
import {
  type LocalProvider,
  isProviderRunning,
  localProviders,
} from '../../lib/local-providers/detect';
import { useAuth } from '../../store/auth';
import { ModelProvider } from '../ais/constants';
import ProviderIcon from '../ais/provider-icon';

/**
 * Reduce a model identifier to a comparison token: lowercase, alphanumerics
 * only. Used to match a catalog repo id (`zenlm/zen-nano-0.6b`) against what an
 * engine reports serving — which is a filesystem path, not the repo id
 * (e.g. `/home/z/models/zen5/zen-nano-0.6b/gguf`). We compare the repo's last
 * path segment against the served id so a loaded model lights up as "Served".
 */
const slug = (s: string): string => s.toLowerCase().replace(/[^a-z0-9]/g, '');

const repoTail = (repo: string): string =>
  slug(repo.slice(repo.lastIndexOf('/') + 1));

/** Probe one engine's OpenAI `/v1/models` and return the served model ids. */
const fetchServedIds = async (baseUrl: string): Promise<string[]> => {
  try {
    const res = await fetch(`${baseUrl}/v1/models`, {
      method: 'GET',
      signal: AbortSignal.timeout(2500),
    });
    if (!res.ok) return [];
    const body = (await res.json()) as { data?: { id: string }[] };
    return (body.data ?? []).map((m) => m.id).filter((id) => id !== 'default');
  } catch {
    return [];
  }
};

/**
 * Live served-model status for the native engines (chat + embed), polled every
 * 10s. THE single served-detection source — probes the brand engine URLs
 * directly (no hardcoded port, no parallel scan hook). A catalog row is "served"
 * when its repo tail appears in a served filesystem path.
 */
const useServedRepos = () => {
  const { data } = useQuery({
    queryKey: ['native-engine-served', getEngineUrl(), getEmbeddingEngineUrl()],
    queryFn: async () => {
      const [chat, embed] = await Promise.all([
        fetchServedIds(getEngineUrl()),
        fetchServedIds(getEmbeddingEngineUrl()),
      ]);
      return [...chat, ...embed].map(slug);
    },
    refetchInterval: 10000,
  });

  return useMemo(() => {
    const servedSlugs = data ?? [];
    return (repo: string): boolean => {
      const tail = repoTail(repo);
      return servedSlugs.some((s) => s.includes(tail) || tail.includes(s));
    };
  }, [data]);
};

/** Engine availability pill, polled every 10s. */
const EngineCard = ({ provider }: { provider: LocalProvider }) => {
  const { data: running, isPending } = useQuery({
    queryKey: ['local-provider-running', provider.id, provider.baseUrl],
    queryFn: () => isProviderRunning(provider),
    refetchInterval: 10000,
  });

  const isNative = provider.id === Models.Hanzo;

  return (
    <Card className={cn('flex flex-col', isNative && 'border-brand/60')}>
      <CardHeader className="flex flex-row items-center gap-3 p-4 pb-2">
        <div className="flex h-7 w-7 items-center justify-center">
          {isNative ? (
            <Cpu className="text-brand h-5 w-5" />
          ) : (
            <ProviderIcon
              provider={
                provider.id === Models.LMStudio
                  ? ModelProvider.LmStudio
                  : ModelProvider['Hanzo-Backend']
              }
            />
          )}
        </div>
        <div className="flex flex-1 flex-col">
          <CardTitle className="flex items-center gap-2 text-sm font-medium">
            {provider.name}
            {isNative && (
              <Badge className="px-1.5 py-0 text-[10px]" variant="secondary">
                Native
              </Badge>
            )}
          </CardTitle>
        </div>
        <Badge
          className="px-2 py-0 text-[10px]"
          variant={running ? 'default' : 'outline'}
        >
          {isPending ? '…' : running ? 'Running' : 'Not detected'}
        </Badge>
      </CardHeader>
      <CardContent className="text-text-secondary px-4 pb-4 text-xs">
        {provider.description}
      </CardContent>
    </Card>
  );
};

const ModelRow = ({
  model,
  served,
}: {
  model: ZenModelEntry;
  served: boolean;
}) => {
  const auth = useAuth((state) => state.auth);

  const { mutate: addProvider, isPending } = useAddLLMProvider({
    onSuccess: () => {
      toast.success(`${model.name} added`, {
        description:
          'The native engine will download it from Hugging Face on first use.',
      });
    },
    onError: (error) => {
      toast.error(`Could not add ${model.name}`, {
        description: error.response?.data?.message ?? error.message,
      });
    },
  });

  const onDownload = () => {
    if (!auth) return;
    const id = `zen_${model.value.replace(/[^a-zA-Z0-9_]/g, '_')}`;
    // Reuse the canonical add-provider flow. The native engine speaks the OpenAI
    // API, so the node registers it as an `OpenAILegacy` provider pointed at the
    // brand engine URL — the SAME wire shape the node provisions its default
    // `zen_engine` agent with (the only model variant the node accepts for a
    // local engine; there is no `hanzo` variant on the wire). `model_type` is the
    // HF repo id, so the on-device engine pulls those weights from Hugging Face on
    // first request. The engine is always reachable and fetches lazily, so we skip
    // the connectivity probe (`enableTest: false`). Embedding models target the
    // embed engine (enginePort + 1).
    addProvider({
      nodeAddress: auth.node_address ?? '',
      token: auth.api_v2_key ?? '',
      enableTest: false,
      agent: {
        id,
        name: model.name,
        full_identity_name: `${auth.hanzo_identity}/${auth.profile}/agent/${id}`,
        external_url: model.embedding ? getEmbeddingEngineUrl() : getEngineUrl(),
        model: { OpenAILegacy: { model_type: model.value } },
      },
    });
  };

  return (
    <div className="border-border-default flex items-center justify-between gap-3 border-b py-2.5 last:border-b-0">
      <div className="flex min-w-0 flex-col">
        <span className="truncate text-sm font-medium">{model.name}</span>
        <span className="text-text-tertiary truncate font-mono text-xs">
          {model.value}
          {model.size ? ` · ${model.size}` : ''}
          {model.format ? ` · ${model.format}` : ''}
        </span>
      </div>
      {served ? (
        <Badge className="shrink-0 gap-1 px-2 py-1" variant="default">
          <Check className="h-3.5 w-3.5" />
          Served
        </Badge>
      ) : (
        <Button
          className="shrink-0"
          disabled={isPending || !auth}
          onClick={onDownload}
          size="xs"
          variant="outline"
        >
          {isPending ? (
            <Loader2 className="mr-1 h-3.5 w-3.5 animate-spin" />
          ) : (
            <Download className="mr-1 h-3.5 w-3.5" />
          )}
          Download
        </Button>
      )}
    </div>
  );
};

const ModelSection = ({
  title,
  description,
  models,
  isServed,
}: {
  title: string;
  description: string;
  models: ZenModelEntry[];
  isServed: (repo: string) => boolean;
}) => {
  if (models.length === 0) return null;
  return (
    <Card>
      <CardHeader className="p-4 pb-2">
        <CardTitle className="text-sm">{title}</CardTitle>
        <CardDescription className="text-xs">{description}</CardDescription>
      </CardHeader>
      <CardContent className="px-4 pt-0 pb-3">
        {models.map((model) => (
          <ModelRow key={model.value} model={model} served={isServed(model.value)} />
        ))}
      </CardContent>
    </Card>
  );
};

/**
 * Local Models — the ONE surface for first-party Zen models on this device.
 *
 * Pick the local engine (native Hanzo / Ollama / LM Studio, live-detected), then
 * browse the Zen catalog segmented Chat / Embeddings / Reranker. Each row shows
 * "Served" when the engine is already serving that model (probed live from the
 * brand engine's `/v1/models`), otherwise "Download" — which registers a `hanzo`
 * provider pointed at the model's Hugging Face repo so the engine fetches the
 * weights natively on first use (the same add-provider path used everywhere — no
 * parallel download flow, no separate served-models list).
 */
export const LocalModelBrowser = ({ className }: { className?: string }) => {
  const isServed = useServedRepos();

  const chatModels = zenCatalog.filter((m) => !m.embedding && !m.reranker);
  const embedModels = zenCatalog.filter((m) => m.embedding);
  const rerankModels = zenCatalog.filter((m) => m.reranker);

  return (
    <div className={cn('flex flex-col gap-4 pb-6', className)}>
      <div className="flex flex-col gap-1">
        <h2 className="text-base font-medium">Engine</h2>
        <p className="text-text-secondary text-xs">
          Pick which engine runs your local models. The native Hanzo engine
          downloads first-party Zen models from Hugging Face; Ollama and LM
          Studio are detected automatically when running.
        </p>
      </div>
      <div className="grid grid-cols-1 gap-3 md:grid-cols-3">
        {localProviders().map((p) => (
          <EngineCard key={p.id} provider={p} />
        ))}
      </div>

      <div className="mt-2 flex flex-col gap-1">
        <h2 className="text-base font-medium">Zen Models</h2>
        <p className="text-text-secondary text-xs">
          First-party models from huggingface.co/zenlm. Rows the engine is
          already serving show “Served”; click Download to add another — the
          on-device engine pulls it from Hugging Face on first use.
        </p>
      </div>

      <ModelSection
        description="Conversational models served by the native engine."
        isServed={isServed}
        models={chatModels}
        title="Chat"
      />
      <ModelSection
        description="Text embedding models for retrieval and vector search (served by the embed engine)."
        isServed={isServed}
        models={embedModels}
        title="Embeddings"
      />
      <ModelSection
        description="Cross-encoder rerankers for retrieval result ordering."
        isServed={isServed}
        models={rerankModels}
        title="Reranker"
      />
    </div>
  );
};

export default LocalModelBrowser;
