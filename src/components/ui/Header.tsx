import React from 'react'
import { Bell, Menu, Search } from 'lucide-react'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { MainMenu } from './MainMenu'

type HeaderProps = {
  t: any;
  lang: string;
  setLang: (lang: string) => void;
}

export function Header({ t, lang, setLang }: HeaderProps) {
  return (
    <header className="flex items-center justify-between px-6 py-4 bg-background border-b">
      <div className="flex items-center w-1/3">
        <Sheet>
          <SheetTrigger asChild>
            <Button variant="ghost" size="icon" className="md:hidden">
              <Menu className="h-6 w-6" />
            </Button>
          </SheetTrigger>
          <SheetContent side="left">
            <SheetHeader>
              <SheetTitle>{t.menu}</SheetTitle>
              <SheetDescription>
                <MainMenu t={t} />
              </SheetDescription>
            </SheetHeader>
          </SheetContent>
        </Sheet>
        <h1 className="text-2xl font-bold ml-2">
          <span className="text-green-500">SageFI</span>
        </h1>
      </div>
      <div className="flex-1 flex justify-center items-center max-w-md w-full">
        <div className="relative w-full">
          <Input
            type="search"
            placeholder={t.search}
            className="w-full pl-10"
          />
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
        </div>
      </div>
      <div className="flex items-center space-x-4 w-1/3 justify-end">
        <Select value={lang} onValueChange={setLang}>
          <SelectTrigger className="w-[80px]">
            <SelectValue placeholder={t.language} />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="pt">PT</SelectItem>
            <SelectItem value="en">EN</SelectItem>
            <SelectItem value="es">ES</SelectItem>
          </SelectContent>
        </Select>
        <Button size="icon" variant="ghost">
          <Bell className="h-5 w-5" />
        </Button>
        <Avatar>
          <AvatarImage src="/placeholder-avatar.jpg" alt="@user" />
          <AvatarFallback>U</AvatarFallback>
        </Avatar>
      </div>
    </header>
  )
}