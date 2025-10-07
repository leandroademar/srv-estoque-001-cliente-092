import { AppSidebar } from "@/components/app-sidebar"
import { SiteHeader } from "@/components/site-header"
import {
  SidebarInset,
  SidebarProvider,
} from "@/components/ui/sidebar"
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { IconFlower, IconTrendingUp, IconPackage, IconShoppingCart } from "@tabler/icons-react"

export default function FlorNEPage() {
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
                    <IconFlower className="size-5 text-primary" />
                  </div>
                  <div>
                    <h1 className="text-2xl font-bold">Flor NE</h1>
                    <p className="text-muted-foreground">Gestão de produtos Flor NE</p>
                  </div>
                </div>
              </div>

              {/* Cards de Resumo */}
              <div className="*:data-[slot=card]:from-primary/5 *:data-[slot=card]:to-card dark:*:data-[slot=card]:bg-card grid grid-cols-1 gap-4 px-4 *:data-[slot=card]:bg-gradient-to-t *:data-[slot=card]:shadow-xs lg:px-6 @xl/main:grid-cols-2 @3xl/main:grid-cols-3 @5xl/main:grid-cols-4">
                {/* Total de Produtos */}
                <Card className="@container/card">
                  <CardHeader>
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <CardDescription>Total de Produtos</CardDescription>
                        <CardTitle className="text-2xl font-semibold tabular-nums @[250px]/card:text-3xl">
                          1.234
                        </CardTitle>
                      </div>
                      <Badge variant="outline" className="gap-1 whitespace-nowrap min-w-fit ml-2">
                        <IconPackage className="size-3" />
                        Flor NE
                      </Badge>
                    </div>
                  </CardHeader>
                  <CardFooter className="flex-col items-start gap-1.5 text-sm">
                    <div className="line-clamp-1 flex gap-2 font-medium">
                      +20.1% em relação ao mês anterior
                    </div>
                    <div className="text-muted-foreground">
                      Produtos da linha Flor NE
                    </div>
                  </CardFooter>
                </Card>

                {/* Vendas do Mês */}
                <Card className="@container/card">
                  <CardHeader>
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <CardDescription>Vendas do Mês</CardDescription>
                        <CardTitle className="text-2xl font-semibold tabular-nums @[250px]/card:text-3xl">
                          R$ 45.231,89
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
                      +12.5% em relação ao mês anterior
                    </div>
                    <div className="text-muted-foreground">
                      Total faturado no período
                    </div>
                  </CardFooter>
                </Card>

                {/* Margem de Lucro */}
                <Card className="@container/card">
                  <CardHeader>
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <CardDescription>Margem de Lucro</CardDescription>
                        <CardTitle className="text-2xl font-semibold tabular-nums @[250px]/card:text-3xl">
                          32.5%
                        </CardTitle>
                      </div>
                      <Badge variant="secondary" className="gap-1 whitespace-nowrap min-w-fit ml-2">
                        <IconTrendingUp className="size-3" />
                        Lucro
                      </Badge>
                    </div>
                  </CardHeader>
                  <CardFooter className="flex-col items-start gap-1.5 text-sm">
                    <div className="line-clamp-1 flex gap-2 font-medium">
                      +2.1% em relação ao mês anterior
                    </div>
                    <div className="text-muted-foreground">
                      Margem média de lucro
                    </div>
                  </CardFooter>
                </Card>
              </div>

              {/* Conteúdo Principal */}
              <div className="px-4 lg:px-6">
                <Card>
                  <CardHeader>
                    <CardTitle>Produtos Flor NE</CardTitle>
                    <CardDescription>
                      Lista de produtos específicos da linha Flor NE
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="text-center py-8">
                      <IconFlower className="mx-auto h-12 w-12 text-muted-foreground" />
                      <h3 className="mt-2 text-sm font-semibold text-gray-900">Em desenvolvimento</h3>
                      <p className="mt-1 text-sm text-muted-foreground">
                        Esta página está sendo desenvolvida para mostrar os produtos específicos da linha Flor NE.
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
