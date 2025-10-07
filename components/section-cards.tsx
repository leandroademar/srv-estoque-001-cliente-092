import { IconTrendingUp, IconPackage, IconFileInvoice, IconShoppingCart } from "@tabler/icons-react"

import { Badge } from "@/components/ui/badge"
import {
  Card,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"

interface Produto {
  CODPROD: number
  DESCRICAO: string
  QT_ESTOQUE_INICIAL: number
  CUSTO_FINANCEIRO: number
  CUSTO_CONTABIL: number
  QT_EST_TRANSF: number
  PVENDA_ICAL: number
  QT_EST_TRIANG: number
  QT_SALDO_ATRIANG: number
  QT_SALDO_ATRANSF: number
  QT_VENDA_REAL: number
  TIPO_PRODUTO: string
  QT_SALDO_ICAL: number
}

interface NotaFiscal {
  CODFILIAL: string
  DTSAIDA: string
  NUMTRANSVENDA: number
  NUMNOTA: number
  TIPOVENDA: string
  VLTOTAL: number
  NUMITENS: number
  SITUACAONFE: number
  CHAVENFE: string
  ROTINACAD: string
  ENTRADA: number
}

interface DetalheMovimento {
  CODFILIAL: string
  NUMNOTA: number
  NUMTRANSVENDA: number
  CODPROD: number
  DESCRICAO: string
  CODOPER: string
  QUANTIDADE: number
  VLR_UNIT: number
  VLR_TOTAL: number
  VLR_VENDA_GERENCIAL: number
  VLR_TOTAL_GERENCIAL: number
}

interface SectionCardsProps {
  produtos: Produto[]
  notasfiscais: NotaFiscal[]
  detalhemovimento: DetalheMovimento[]
}

export function SectionCards({ produtos, notasfiscais, detalhemovimento }: SectionCardsProps) {
  const totalProdutos = produtos.length
  const produtosAtivos = produtos.filter(p => p.QT_SALDO_ICAL > 0).length
  const produtosConcluidos = produtos.filter(p => p.QT_SALDO_ICAL <= 0).length

  const valorSaldoInicial = produtos.reduce((acc, p) => acc + (p.QT_ESTOQUE_INICIAL * p.PVENDA_ICAL), 0)
  const valorSaldoAtual = produtos.reduce((acc, p) => acc + (p.QT_SALDO_ICAL * p.PVENDA_ICAL), 0)
  const valorCustoFinanceiro = produtos.reduce((acc, p) => acc + (p.QT_SALDO_ICAL * p.CUSTO_FINANCEIRO), 0)

  const totalNotasFiscais = notasfiscais.length
  const valorTotalVendas = notasfiscais.reduce((acc, nf) => acc + nf.VLTOTAL, 0)
  const totalItensFaturados = notasfiscais.reduce((acc, nf) => acc + nf.NUMITENS, 0)

  const totalMovimentos = detalhemovimento.length
  const quantidadeTotalMovimentos = detalhemovimento.reduce((acc, mov) => acc + mov.QUANTIDADE, 0)
  const valorTotalGerencial = detalhemovimento.reduce((acc, mov) => acc + mov.VLR_TOTAL_GERENCIAL, 0)

  const formatCurrency = (value: number) => {
    return value.toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })
  }

  const formatNumber = (value: number) => {
    return value.toLocaleString('pt-BR')
  }

  return (
    <div className="grid grid-cols-1 gap-4 px-4 lg:px-6 @xl/main:grid-cols-2 @3xl/main:grid-cols-3 @5xl/main:grid-cols-4">
      {/* Card 1 - Produtos */}
      <Card className="@container/card bg-gradient-to-t from-primary/5 to-card dark:bg-card shadow-xs">
        <CardHeader className="flex-row items-start justify-between gap-2">
          <div className="flex-1 min-w-0">
            <CardDescription>Produtos</CardDescription>
            <CardTitle className="text-2xl font-semibold tabular-nums @[250px]/card:text-3xl">
              {formatNumber(totalProdutos)}
            </CardTitle>
          </div>
          <Badge variant="outline" className="shrink-0 gap-1 whitespace-nowrap">
            <IconPackage className="size-3" />
            SKUs
          </Badge>
        </CardHeader>
        <CardFooter className="flex-col items-start gap-1.5 text-sm">
          <div className="flex gap-2">
            <Badge variant="outline" className="text-xs whitespace-nowrap">
              {produtosAtivos} Ativos
            </Badge>
            <Badge variant="secondary" className="text-xs bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400 whitespace-nowrap">
              {produtosConcluidos} Concluídos
            </Badge>
          </div>
          <div className="text-muted-foreground">
            Quantidade de produtos no estoque ICAL Virada
          </div>
        </CardFooter>
      </Card>

      {/* Card 2 - Valor Saldo Inicial */}
      <Card className="@container/card bg-gradient-to-t from-primary/5 to-card dark:bg-card shadow-xs">
        <CardHeader className="flex-row items-start justify-between gap-2">
          <div className="flex-1 min-w-0">
            <CardDescription>Valor Saldo Inicial</CardDescription>
            <CardTitle className="text-2xl font-semibold tabular-nums @[250px]/card:text-3xl">
              R$ {formatCurrency(valorSaldoInicial)}
            </CardTitle>
          </div>
          <Badge variant="outline" className="shrink-0 gap-1 whitespace-nowrap">
            <IconTrendingUp className="size-3" />
            P. Venda
          </Badge>
        </CardHeader>
        <CardFooter className="flex-col items-start gap-1.5 text-sm">
          <div className="line-clamp-1 font-medium">
            Estoque inicial a preço de venda
          </div>
          <div className="text-muted-foreground">
            Baseado no saldo inicial
          </div>
        </CardFooter>
      </Card>

      {/* Card 3 - Valor Saldo Atual */}
      <Card className="@container/card bg-gradient-to-t from-primary/5 to-card dark:bg-card shadow-xs">
        <CardHeader className="flex-row items-start justify-between gap-2">
          <div className="flex-1 min-w-0">
            <CardDescription>Valor Saldo Atual</CardDescription>
            <CardTitle className="text-2xl font-semibold tabular-nums @[250px]/card:text-3xl">
              R$ {formatCurrency(valorSaldoAtual)}
            </CardTitle>
          </div>
          <Badge variant="outline" className="shrink-0 gap-1 whitespace-nowrap">
            <IconTrendingUp className="size-3" />
            P. Venda
          </Badge>
        </CardHeader>
        <CardFooter className="flex-col items-start gap-1.5 text-sm">
          <div className="line-clamp-1 font-medium">
            Estoque atual a preço de venda
          </div>
          <div className="text-muted-foreground">
            Baseado no saldo atual
          </div>
        </CardFooter>
      </Card>

      {/* Card 4 - Valor Saldo Realizado */}
      <Card className="@container/card bg-gradient-to-t from-primary/5 to-card dark:bg-card shadow-xs">
        <CardHeader className="flex-row items-start justify-between gap-2">
          <div className="flex-1 min-w-0">
            <CardDescription>Valor Saldo Realizado</CardDescription>
            <CardTitle className="text-2xl font-semibold tabular-nums @[250px]/card:text-3xl">
              R$ {formatCurrency(valorTotalGerencial)}
            </CardTitle>
          </div>
          <Badge variant="outline" className="shrink-0 gap-1 whitespace-nowrap">
            <IconFileInvoice className="size-3" />
            {formatNumber(totalNotasFiscais)} NF
          </Badge>
        </CardHeader>
        <CardFooter className="flex-col items-start gap-1.5 text-sm">
          <div className="line-clamp-1 font-medium">
            {formatNumber(totalMovimentos)} produtos movimentados
          </div>
          <div className="text-muted-foreground">
            Valor NF: R$ {formatCurrency(valorTotalVendas)}
          </div>
        </CardFooter>
      </Card>
    </div>
  )
}