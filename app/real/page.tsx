import { AppSidebar } from "@/components/app-sidebar"
import { SiteHeader } from "@/components/site-header"
import {
  SidebarInset,
  SidebarProvider,
} from "@/components/ui/sidebar"
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { IconCurrencyReal, IconTrendingUp, IconPackage, IconShoppingCart, IconCash } from "@tabler/icons-react"

export default function RealPage() {
  return (
    <SidebarProvider
      style={
        {
          "--sidebar-width": "calc(var(--spacing) * 72)",
          "--header-height": "calc(var(--spacing) * 12)",
        } as React.CSSProperties
      }
    >
      <AppSidebar variant="inset" />
      <SidebarInset>
        <SiteHeader />
        <div className="flex flex-1 flex-col">
          <div className="@container/main flex flex-1 flex-col gap-2">
            <div className="flex flex-col gap-4 py-4 md:gap-6 md:py-6">
              {/* Header */}
              <div className="px-4 lg:px-6">
                <div className="flex items-center gap-3">
                  <div className="flex size-10 items-center justify-center rounded-lg bg-primary/10">
                    <IconCurrencyReal className="size-5 text-primary" />
                  </div>
                  <div>
                    <h1 className="text-2xl font-bold">Real</h1>
                    <p className="text-muted-foreground">Gestão financeira e vendas em Real</p>
                  </div>
                </div>
              </div>

              {/* Cards de Resumo */}
              <div className="*:data-[slot=card]:from-primary/5 *:data-[slot=card]:to-card dark:*:data-[slot=card]:bg-card grid grid-cols-1 gap-4 px-4 *:data-[slot=card]:bg-gradient-to-t *:data-[slot=card]:shadow-xs lg:px-6 @xl/main:grid-cols-2 @3xl/main:grid-cols-3 @5xl/main:grid-cols-4">
                {/* Receita Total */}
                <Card className="@container/card">
                  <CardHeader>
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <CardDescription>Receita Total</CardDescription>
                        <CardTitle className="text-2xl font-semibold tabular-nums @[250px]/card:text-3xl">
                          R$ 125.430,50
                        </CardTitle>
                      </div>
                      <Badge variant="outline" className="gap-1 whitespace-nowrap min-w-fit ml-2">
                        <IconCash className="size-3" />
                        Real
                      </Badge>
                    </div>
                  </CardHeader>
                  <CardFooter className="flex-col items-start gap-1.5 text-sm">
                    <div className="line-clamp-1 flex gap-2 font-medium">
                      +15.3% em relação ao mês anterior
                    </div>
                    <div className="text-muted-foreground">
                      Receita total acumulada
                    </div>
                  </CardFooter>
                </Card>

                {/* Vendas Realizadas */}
                <Card className="@container/card">
                  <CardHeader>
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <CardDescription>Vendas Realizadas</CardDescription>
                        <CardTitle className="text-2xl font-semibold tabular-nums @[250px]/card:text-3xl">
                          892
                        </CardTitle>
                      </div>
                      <Badge variant="outline" className="gap-1 whitespace-nowrap min-w-fit ml-2">
                        <IconShoppingCart className="size-3" />
                        Vendas
                      </Badge>
                    </div>
                  </CardHeader>
                  <CardFooter className="flex-col items-start gap-1.5 text-sm">
                    <div className="line-clamp-1 flex gap-2 font-medium">
                      +8.7% em relação ao mês anterior
                    </div>
                    <div className="text-muted-foreground">
                      Total de transações realizadas
                    </div>
                  </CardFooter>
                </Card>

                {/* Ticket Médio */}
                <Card className="@container/card">
                  <CardHeader>
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <CardDescription>Ticket Médio</CardDescription>
                        <CardTitle className="text-2xl font-semibold tabular-nums @[250px]/card:text-3xl">
                          R$ 140,62
                        </CardTitle>
                      </div>
                      <Badge variant="secondary" className="gap-1 whitespace-nowrap min-w-fit ml-2">
                        <IconTrendingUp className="size-3" />
                        Média
                      </Badge>
                    </div>
                  </CardHeader>
                  <CardFooter className="flex-col items-start gap-1.5 text-sm">
                    <div className="line-clamp-1 flex gap-2 font-medium">
                      +6.1% em relação ao mês anterior
                    </div>
                    <div className="text-muted-foreground">
                      Valor médio por transação
                    </div>
                  </CardFooter>
                </Card>
              </div>

              {/* Conteúdo Principal */}
              <div className="px-4 lg:px-6">
                <Card>
                  <CardHeader>
                    <CardTitle>Análise Financeira</CardTitle>
                    <CardDescription>
                      Relatórios e métricas financeiras em Real brasileiro
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="text-center py-8">
                      <IconCurrencyReal className="mx-auto h-12 w-12 text-muted-foreground" />
                      <h3 className="mt-2 text-sm font-semibold text-gray-900">Em desenvolvimento</h3>
                      <p className="mt-1 text-sm text-muted-foreground">
                        Esta página está sendo desenvolvida para mostrar análises financeiras específicas em Real.
                      </p>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
          </div>
        </div>
      </SidebarInset>
    </SidebarProvider>
  )
}
