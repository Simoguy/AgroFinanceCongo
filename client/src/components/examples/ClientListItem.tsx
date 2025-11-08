import ClientListItem from "../ClientListItem";

export default function ClientListItemExample() {
  return (
    <div className="space-y-2 p-4">
      <ClientListItem
        name="Marie Kamanga"
        phone="+243 812 345 678"
        amount="1,500 FC"
        status="active"
        onClick={() => console.log("Marie clicked")}
      />
      <ClientListItem
        name="Jean-Paul Mbala"
        phone="+243 899 234 567"
        amount="3,200 FC"
        status="warning"
        onClick={() => console.log("Jean-Paul clicked")}
      />
      <ClientListItem
        name="Grace Mulamba"
        phone="+243 823 456 789"
        amount="0 FC"
        status="settled"
        onClick={() => console.log("Grace clicked")}
      />
    </div>
  );
}
